import { AliasActionResult, ActionResult } from '../../src/AliasActionResult';
import { expect } from 'chai';

describe('Test AliasActionResult', ()=>{
    it('Test getActionResult', ()=>{
        let aliasActionResult = new AliasActionResult(
            "alias1",
            [
                new ActionResult("turnPower", true),
                new ActionResult("setPresetTemp", false, {key:"value"}, "invalid value"),
                new ActionResult("turnPower", false, null, "invalid value")
            ]);

        expect(aliasActionResult.alias, "alias1");
        expect(aliasActionResult.actionResults.length).to.equals(3);
        let result1 = aliasActionResult.actionResults[0];
        expect(result1.actionName).equals("turnPower");
        expect(result1.succeeded).true;
        expect(result1.data).undefined;
        expect(result1.errorMessage).undefined;
        let result2 = aliasActionResult.actionResults[1];
        expect(result2.actionName).equals("setPresetTemp");
        expect(result2.succeeded).false;
        expect(result2.data).deep.equal({key: "value"});
        expect(result2.errorMessage).equals("invalid value");
        let result3 = aliasActionResult.actionResults[2];
        expect(result3.actionName).equals("turnPower");
        expect(result3.succeeded).false;
        expect(result3.data).null;
        expect(result3.errorMessage).equals("invalid value");

        let foundResults = aliasActionResult.getActionResults("turnPower");
        expect(foundResults.length).equals(2);
        expect(foundResults[0]).deep.equal(new ActionResult("turnPower", true));
        expect(foundResults[1]).deep.equal(new ActionResult("turnPower", false, null, "invalid value"));

    })
})