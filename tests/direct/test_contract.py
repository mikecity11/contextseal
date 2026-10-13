import json
import pytest

RULES = 'Preserve all risk warnings and uncertainty. No unconditional endorsement.'
ORIGINAL = 'I like the product, but it has risks and I am still testing it.'
EDITED = 'I like the product.'
RESULT = {'verdict':'OUTSIDE_RULES','reason':'The risk warning was removed despite the agreed preservation rule.', 'original_quote':'but it has risks', 'edited_quote':'I like the product.'}

@pytest.fixture
def case(direct_vm, direct_deploy, direct_bob):
    c=direct_deploy('contracts/contextseal.py', sdk_version='v0.2.16')
    c.create_agreement('case1','0x'+bytes(direct_bob).hex(),RULES,ORIGINAL)
    return c

def accepted(case,direct_vm,direct_bob):
    with direct_vm.prank(direct_bob):
        case.accept_rules('case1')
        case.submit_edit('case1',EDITED)

def test_baseline(case):
    c=json.loads(case.get_case('case1'))
    assert c['status']=='AWAITING_BRAND' and c['rules']==RULES
    assert case.list_cases(0,10)==['case1']

def test_brand_authorization(case,direct_vm):
    with pytest.raises(Exception,match='Only named brand'):
        case.accept_rules('case1')
    with pytest.raises(Exception,match='Only named brand'):
        case.submit_edit('case1',EDITED)

def test_no_self_agreement(direct_deploy,direct_owner):
    c=direct_deploy('contracts/contextseal.py', sdk_version='v0.2.16')
    with pytest.raises(Exception,match='must differ'):
        c.create_agreement('same','0x'+bytes(direct_owner).hex(),RULES,ORIGINAL)

def test_immutable_id(case,direct_bob):
    with pytest.raises(Exception,match='Unique'):
        case.create_agreement('case1','0x'+bytes(direct_bob).hex(),'Replacement',ORIGINAL)

def test_acceptance_required(case,direct_vm,direct_bob):
    with direct_vm.prank(direct_bob),pytest.raises(Exception,match='acceptance'):
        case.submit_edit('case1',EDITED)

def test_consensus(case,direct_vm,direct_bob):
    accepted(case,direct_vm,direct_bob)
    direct_vm.mock_llm(r'.*',json.dumps(RESULT))
    case.review_edit('case1')
    assert json.loads(case.get_case('case1'))['status']=='OUTSIDE_RULES'
    assert direct_vm.run_validator() is True
    direct_vm.clear_mocks()
    direct_vm.mock_llm(r'.*',json.dumps({**RESULT,'verdict':'WITHIN_RULES'}))
    assert direct_vm.run_validator() is False

def test_unsupported_quote(case,direct_vm,direct_bob):
    accepted(case,direct_vm,direct_bob)
    direct_vm.mock_llm(r'.*',json.dumps({**RESULT,'original_quote':'fabricated quote'}))
    with pytest.raises(Exception,match='Unsupported quote'):
        case.review_edit('case1')
    assert json.loads(case.get_case('case1'))['status']=='READY_FOR_REVIEW'

def test_revisions(case,direct_vm,direct_bob):
    accepted(case,direct_vm,direct_bob)
    with direct_vm.prank(direct_bob),pytest.raises(Exception,match='Review existing'):
        case.submit_edit('case1',ORIGINAL)
    direct_vm.mock_llm(r'.*',json.dumps(RESULT));case.review_edit('case1')
    with direct_vm.prank(direct_bob):case.submit_edit('case1',ORIGINAL)
    assert json.loads(case.get_case('case1'))['revision']==2
    assert len(json.loads(case.get_case('case1'))['reviews'])==1

def test_abstain(case,direct_vm,direct_bob):
    accepted(case,direct_vm,direct_bob)
    direct_vm.mock_llm(r'.*',json.dumps({'verdict':'INSUFFICIENT_EVIDENCE','reason':'More context needed.','original_quote':'','edited_quote':''}))
    case.review_edit('case1')
    assert json.loads(case.get_case('case1'))['status']=='INSUFFICIENT_EVIDENCE'

def test_bad_verdict(case,direct_vm,direct_bob):
    accepted(case,direct_vm,direct_bob)
    direct_vm.mock_llm(r'.*',json.dumps({**RESULT,'verdict':'PAY_CREATOR'}))
    with pytest.raises(Exception,match='Bad verdict'):case.review_edit('case1')
