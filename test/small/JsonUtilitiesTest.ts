import { expect } from 'chai';
import { actionToJson, jsonToAction, aliasActionToJson, jsonToAliasAction, jsonToActionResult, jsonToAliasActionResult } from '../../src/internal/JsonUtilities';
import { Action, AliasAction } from '../../src/AliasAction';
import { ActionResult, AliasActionResult } from '../../src/AliasActionResult';

describe('Test JsonUtilities', () => {
    it('Test actionToJson()', () => {
        expect(actionToJson(new Action(null, null))).deep.equal({});
        expect(actionToJson(new Action("turnPower", true))).deep.equal({ turnPower: true });
        expect(actionToJson(<any>34)).deep.equal({});
        expect(actionToJson(<any>null)).deep.equal({});
    })

    it('Test jsonToAction()', () => {
        expect(jsonToAction({ "turnPower": true })).deep.equal(new Action("turnPower", true));
        expect(jsonToAction(<any>34)).null;
        expect(jsonToAction({ "turnPower": true, "setPresetTemp": 23 })).null;
    })

    it('Test aliasActionToJson()', () => {
        expect(aliasActionToJson(new AliasAction("alias1", [new Action("turnPower", true)])))
            .deep.equal({
                alias1: [
                    { "turnPower": true }]
            }
            );
        expect(aliasActionToJson(<any>{})).deep.equal({});
        expect(aliasActionToJson(<any>null)).deep.equal({});
    })

    it('Test jsonToAliasAction()', () => {
        expect(jsonToAliasAction({ alias1: [{ turnPower: true }, { setPresetTemp: 23 }] })).deep.equal(
            new AliasAction(
                "alias1", [
                    new Action("turnPower", true),
                    new Action("setPresetTemp", 23)])
        );
        expect(jsonToAliasAction({})).null;
        expect(jsonToAliasAction({
            alias1: [{ turnPower: true }, { setPresetTemp: 23 }],
            alias2: [{ setPresetHumd: 56 }]
        })).null;
    })

    it('Test jsonToActionResult()', () => {
        expect(jsonToActionResult(
            {
                turnPower:
                { succeeded: true }
            })).deep.equal(new ActionResult("turnPower", true));
        expect(jsonToActionResult(
            {
                turnPower: {
                    succeeded: false,
                    data: { key: "value" },
                    errorMessage: "invalid value"
                }
            })).deep.equal(new ActionResult("turnPower", false, { key: "value" }, "invalid value"));

        expect(jsonToActionResult({})).null;
        expect(jsonToActionResult(
            {
                turnPower: {}
            })).null;
    })

    it('Test jsonToAliasActionResult()', () => {
        expect(jsonToAliasActionResult(
            {
                alias1: [
                    {
                        turnPower:
                        { succeeded: true }

                    },
                    {
                        setPresetTemp: {
                            succeeded: false,
                            data: { key: "value" },
                            errorMessage: "invalid value"
                        }
                    }
                ]
            }
        )).deep.equal(new AliasActionResult("alias1", [
            new ActionResult("turnPower", true),
            new ActionResult("setPresetTemp", false, { key: "value" }, "invalid value")
        ]));

        expect(jsonToAliasActionResult({})).null;
        expect(jsonToAliasActionResult({
            alias1: {}
        })).null;
    })
})