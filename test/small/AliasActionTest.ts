import { AliasAction, Action } from '../../src/AliasAction';
import { expect } from 'chai';

describe('Test AliasAction', ()=> {
    it("Test constructor", () => {
        let aliasAction1 = new AliasAction(
            "alias1",
            [
                new Action("turnPower", true),
                new Action("setPresetTemp", 23)
            ]);
        expect(aliasAction1.alias).to.equals("alias1");
        expect(aliasAction1.actions.length).to.equals(2);
        expect(aliasAction1.actions[0]).to.deep.equal(new Action("turnPower", true));
        expect(aliasAction1.actions[1]).to.deep.equal(new Action("setPresetTemp", 23));
    });

    it('Test getAction()', ()=> {
        let aliasAction = new AliasAction(
            "alias1",
            [
                new Action("turnPower", true),
                new Action("setPresetTemp", 23),
                new Action("turnPower", false)
            ]);

        let foundActions1 = aliasAction.getAction("turnPower");
        expect(foundActions1.length).to.equals(2);
        expect(foundActions1[0]).to.deep.equal(new Action("turnPower", true));
        expect(foundActions1[1]).to.deep.equal(new Action("turnPower", false));

        let foundActions2 = aliasAction.getAction("setPresetTemp");
        expect(foundActions2.length).to.equals(1);
        expect(foundActions2[0]).to.deep.equal(new Action("setPresetTemp", 23));

        let foundActions3 = aliasAction.getAction("setPresetHumidity");
        expect(foundActions3.length).to.equals(0);
    })
})