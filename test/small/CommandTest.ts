/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
import { Command, CommandState } from '../../src/Command';
import { TypedID, Types } from '../../src/TypedID';
import { AliasAction, Action } from '../../src/AliasAction';
import { expect } from 'chai';
import { APIAuthor } from '../../src/APIAuthor';
import { AliasActionResult, ActionResult } from '../../src/AliasActionResult';

describe('Test Command', () => {
    it('constructor with required attributes', () => {
        let target = new TypedID(Types.Thing, "thing-1");
        let issuer = new TypedID(Types.User, "user-1");
        let aas = [
            new AliasAction("alias1", [
                new Action("turnPower", true),
                new Action("setPresetTemp", 23)
            ]),
            new AliasAction("alias2", [
                new Action("setPresetHum", 45)
            ]),
            new AliasAction("alias1", [
                new Action("turnPower", false)
            ])
        ];
        let cmd = new Command(
            target,
            issuer,
            aas
        );

        expect(cmd.targetID).not.undefined;
        expect(cmd.targetID.type).equals(Types.Thing);
        expect(cmd.targetID.id).equals("thing-1");

        expect(cmd.issuerID).not.undefined;
        expect(cmd.issuerID.type).equals(Types.User);
        expect(cmd.issuerID.id).equals("user-1");

        // check optional fields
        expect(cmd.firedByTriggerID).undefined;
        expect(cmd.aliasActionResults).undefined;
        expect(cmd.commandState).undefined;
        expect(cmd.commandID).undefined;
        expect(cmd.created).undefined;
        expect(cmd.modified).undefined;
        expect(cmd.description).undefined;
        expect(cmd.metadata).undefined;
        expect(cmd.title).undefined;

        // check aliasActions
        expect(cmd.aliasActions).not.undefined;
        expect(cmd.aliasActions.length).equals(3);
        let aa1 = cmd.aliasActions[0];
        expect(aa1.alias).equals("alias1");
        expect(aa1.actions.length).equals(2);
        let a11 = aa1.actions[0];
        expect(a11.name).equals("turnPower");
        expect(a11.value).true;
        let a12 = aa1.actions[1];
        expect(a12.name).equals("setPresetTemp");
        expect(a12.value).equals(23);

        let aa2 = cmd.aliasActions[1];
        expect(aa2.alias).equals("alias2");
        expect(aa2.actions.length).equals(1);
        let a21 = aa2.actions[0];
        expect(a21.name).equals("setPresetHum");
        expect(a21.value).equals(45);

        let aa3 = cmd.aliasActions[2];
        expect(aa3.alias).equals("alias1");
        expect(aa3.actions.length).equals(1);
        let a31 = aa3.actions[0];
        expect(a31.name).equals("turnPower");
        expect(a31.value).false;
    })

    it('constructor with options attributes', () => {
        let target = new TypedID(Types.Thing, "thing-1");
        let issuer = new TypedID(Types.User, "user-1");
        let aas = [
            new AliasAction("alias1", [
                new Action("turnPower", true),
                new Action("setPresetTemp", 23)
            ]),
            new AliasAction("alias2", [
                new Action("setPresetHum", 45)
            ]),
            new AliasAction("alias1", [
                new Action("turnPower", false)
            ])
        ];
        let aars = [
            new AliasActionResult("alias1", [
                new ActionResult("turnPower", true),
                new ActionResult("setPresetTemp", false, { key: "value" }, "invalid value")
            ]),
            new AliasActionResult("alias2", [
                new ActionResult("setPresetHum", false, null, "invalid value")
            ]),
            new AliasActionResult("alias1", [
                new ActionResult("turnPower", false, { key: "value" })
            ])
        ];
        let createdAt = new Date();
        let modifiedAt = new Date();
        let cmd = new Command(
            target,
            issuer,
            aas,
            "command-1",
            aars,
            CommandState.INCOMPLETE,
            "trigger-1",
            createdAt,
            modifiedAt,
            "command title",
            "command description",
            { key1: "value1" }
        );

        expect(cmd.targetID).not.undefined;
        expect(cmd.targetID.type).equals(Types.Thing);
        expect(cmd.targetID.id).equals("thing-1");

        expect(cmd.issuerID).not.undefined;
        expect(cmd.issuerID.type).equals(Types.User);
        expect(cmd.issuerID.id).equals("user-1");

        // check optional fields
        expect(cmd.commandState).equals(CommandState.INCOMPLETE);
        expect(cmd.firedByTriggerID).equals("trigger-1");
        expect(cmd.created).deep.equal(createdAt);
        expect(cmd.modified).deep.equal(modifiedAt);
        expect(cmd.title).equals("command title");
        expect(cmd.description).equals("command description");
        expect(cmd.metadata).deep.equal({ key1: "value1" });
        expect(cmd.commandID).equals("command-1");

        // check aliasActions
        expect(cmd.aliasActions).not.undefined;
        expect(cmd.aliasActions.length).equals(3);
        let aa1 = cmd.aliasActions[0];
        expect(aa1.alias).equals("alias1");
        expect(aa1.actions.length).equals(2);
        let a11 = aa1.actions[0];
        expect(a11.name).equals("turnPower");
        expect(a11.value).true;
        let a12 = aa1.actions[1];
        expect(a12.name).equals("setPresetTemp");
        expect(a12.value).equals(23);

        let aa2 = cmd.aliasActions[1];
        expect(aa2.alias).equals("alias2");
        expect(aa2.actions.length).equals(1);
        let a21 = aa2.actions[0];
        expect(a21.name).equals("setPresetHum");
        expect(a21.value).equals(45);

        let aa3 = cmd.aliasActions[2];
        expect(aa3.alias).equals("alias1");
        expect(aa3.actions.length).equals(1);
        let a31 = aa3.actions[0];
        expect(a31.name).equals("turnPower");
        expect(a31.value).false;

        // check aliasActionResults
        expect(cmd.aliasActionResults).not.undefined;
        expect(cmd.aliasActionResults.length).equals(3);

        let aar1 = cmd.aliasActionResults[0];
        expect(aar1.alias).equals("alias1");
        expect(aar1.actionResults.length).equals(2);
        let ar11 = aar1.actionResults[0];
        expect(ar11.actionName).equals("turnPower");
        expect(ar11.succeeded).true;
        expect(ar11.data).undefined;
        expect(ar11.errorMessage).undefined;
        let ar12 = aar1.actionResults[1];
        expect(ar12.actionName).equals("setPresetTemp");
        expect(ar12.succeeded).false;
        expect(ar12.data).deep.equal({ key: "value" });
        expect(ar12.errorMessage).equals("invalid value");

        let aar2 = cmd.aliasActionResults[1];
        expect(aar2.alias).equals("alias2");
        expect(aar2.actionResults.length).equals(1);
        let ar21 = aar2.actionResults[0];
        expect(ar21.actionName).equals("setPresetHum");
        expect(ar21.succeeded).false;
        expect(ar21.data).null;
        expect(ar21.errorMessage).equals("invalid value");

        let aar3 = cmd.aliasActionResults[2];
        expect(aar3.alias).equals("alias1");
        expect(aar3.actionResults.length).equals(1);
        let ar31 = aar3.actionResults[0];
        expect(ar31.actionName).equals("turnPower");
        expect(ar31.succeeded).false;
        expect(ar31.data).deep.equal({ key: "value" });
        expect(ar31.errorMessage).undefined;
    })

    it('test getAliasActions()', () => {
        let target = new TypedID(Types.Thing, "thing-1");
        let issuer = new TypedID(Types.User, "user-1");
        let aas = [
            new AliasAction("alias1", [
                new Action("turnPower", true),
                new Action("setPresetTemp", 23)
            ]),
            new AliasAction("alias2", [
                new Action("setPresetHum", 45)
            ]),
            new AliasAction("alias1", [
                new Action("turnPower", false)
            ])
        ];
        let cmd = new Command(
            target,
            issuer,
            aas,
            "command-1");

        let foundAAs = cmd.getAliasActions("alias1");
        expect(foundAAs.length).equals(2);
        let aa4 = foundAAs[0];
        expect(aa4.alias).equals("alias1");
        expect(aa4.actions.length).equals(2);
        let a41 = aa4.actions[0];
        expect(a41.name).equals("turnPower");
        expect(a41.value).true;
        let a42 = aa4.actions[1];
        expect(a42.name).equals("setPresetTemp");
        expect(a42.value).equals(23);
        let aa5 = foundAAs[1];
        expect(aa5.alias).equals("alias1");
        expect(aa5.actions.length).equals(1);
        let a51 = aa5.actions[0];
        expect(a51.name).equals("turnPower");
        expect(a51.value).false;
    })

    it('test getAliasActionResults()', () => {
        let target = new TypedID(Types.Thing, "thing-1");
        let issuer = new TypedID(Types.User, "user-1");
        let aas = [
            new AliasAction("alias1", [
                new Action("turnPower", true),
                new Action("setPresetTemp", 23)
            ]),
            new AliasAction("alias2", [
                new Action("setPresetHum", 45)
            ]),
            new AliasAction("alias1", [
                new Action("turnPower", false)
            ])
        ];
        let aars = [
            new AliasActionResult("alias1", [
                new ActionResult("turnPower", true),
                new ActionResult("setPresetTemp", false, { key: "value" }, "invalid value")
            ]),
            new AliasActionResult("alias2", [
                new ActionResult("setPresetHum", false, null, "invalid value")
            ]),
            new AliasActionResult("alias1", [
                new ActionResult("turnPower", false, { key: "value" })
            ])
        ];
        let createdAt = new Date();
        let modifiedAt = new Date();
        let cmd = new Command(
            target,
            issuer,
            aas,
            "command-1",
            aars,
            CommandState.INCOMPLETE,
            "trigger-1",
            createdAt,
            modifiedAt,
            "command title",
            "command description",
            { key1: "value1" }
        );

        let foundAARs = cmd.getAliasActionResults("alias1");
        expect(foundAARs.length).equals(2);

        let aar1 = foundAARs[0];
        expect(aar1.alias).equals("alias1");
        expect(aar1.actionResults.length).equals(2);
        let ar11 = aar1.actionResults[0];
        expect(ar11.actionName).equals("turnPower");
        expect(ar11.succeeded).true;
        expect(ar11.data).undefined;
        expect(ar11.errorMessage).undefined;
        let ar12 = aar1.actionResults[1];
        expect(ar12.actionName).equals("setPresetTemp");
        expect(ar12.succeeded).false;
        expect(ar12.data).deep.equal({ key: "value" });
        expect(ar12.errorMessage).equals("invalid value");

        let aar3 = foundAARs[1];
        expect(aar3.alias).equals("alias1");
        expect(aar3.actionResults.length).equals(1);
        let ar31 = aar3.actionResults[0];
        expect(ar31.actionName).equals("turnPower");
        expect(ar31.succeeded).false;
        expect(ar31.data).deep.equal({ key: "value" });
        expect(ar31.errorMessage).undefined;
    })
})