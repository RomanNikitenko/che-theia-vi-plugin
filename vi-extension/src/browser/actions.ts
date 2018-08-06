/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { KeyCode } from "@theia/core/lib/browser";
import { inject, injectable } from "inversify";
import { ModeManager } from "./mode/mode-manager";
import { ModeType } from "./mode/mode";

@injectable()
export abstract class BaseAction {
    protected readonly keyCodes: KeyCode[] = [];

    constructor(keys: string[]) {
        for (const key of keys) {
            //KeyCode.createKeyCode({ first: k, modifiers: [KeyModifier.CTRL] }).toString(),
            //see terminal-fronted-contribution.ts
            const keyCode = KeyCode.parse(key);
            this.keyCodes.push(keyCode);
        }
    }

    public canHandle(keyCode: KeyCode): boolean {
        if (this.keyCodes.find(it => it.equals(keyCode))) {
            return true;
        }

        return false;
    }

    abstract performe(event: KeyboardEvent): void;
}

@injectable()
export class NormalModeAction extends BaseAction {
    constructor(@inject(ModeManager) protected readonly modeManager: ModeManager) {
        super(['esc', 'ctrl+[']);
    }

    public performe(event: KeyboardEvent) {
        console.log('performe normal ');
        
        event.preventDefault();
        event.stopPropagation();
        
        this.modeManager.setCurrentMode(ModeType.Normal);
    }
}

@injectable()
export class InsertModeAction extends BaseAction {
    constructor(@inject(ModeManager) protected readonly modeHandler: ModeManager) {
        super(['i']);
    }

    public performe(event: KeyboardEvent) {
        console.log('performe insert ');

        event.preventDefault();
        event.stopPropagation();
        
        this.modeHandler.setCurrentMode(ModeType.Insert);
    }
}

@injectable()
export class ActionsRegistry {
    private allActions: BaseAction[] = [];

    constructor(@inject(NormalModeAction) protected readonly normalModeAction: NormalModeAction,
        @inject(InsertModeAction) protected readonly insertModeAction: InsertModeAction) {
        this.allActions.push(normalModeAction);
        this.allActions.push(insertModeAction);
    }

    public getRelevantAction(keysPressed: KeyCode): BaseAction | undefined {
        return this.allActions.find(action => action.canHandle(keysPressed));
    }
}

