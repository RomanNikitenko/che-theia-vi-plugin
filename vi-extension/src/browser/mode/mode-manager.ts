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

import { Mode, ModeType, INSERT_MODE_STATUS_TEXT, VISUAL_MODE_STATUS_TEXT, NORMAL_MODE_STATUS_TEXT, NORMAL_MODE_CURSOR_STYLE, INSERT_MODE_CURSOR_STYLE, VISUAL_MODE_CURSOR_STYLE, REPLACE_MODE_CURSOR_STYLE, REPLACE_MODE_STATUS_TEXT } from "./mode";
import { injectable, inject } from "inversify";
import { StatusBar, StatusBarAlignment } from "@theia/core/lib/browser";
import { Event, Emitter } from "@theia/core";

@injectable()
export class ModeManager {
    private _modes: Mode[];
    private _currentMode: Mode;

    private onModeChangedEmitter = new Emitter<Mode>();
    onModeChanged: Event<Mode> = this.onModeChangedEmitter.event;

    constructor(@inject(StatusBar) protected readonly statusBar: StatusBar) {
        this._modes = [
            new Mode(ModeType.Normal, NORMAL_MODE_CURSOR_STYLE, NORMAL_MODE_STATUS_TEXT),
            new Mode(ModeType.Insert, INSERT_MODE_CURSOR_STYLE, INSERT_MODE_STATUS_TEXT),
            new Mode(ModeType.Visual, VISUAL_MODE_CURSOR_STYLE, VISUAL_MODE_STATUS_TEXT),
            new Mode(ModeType.Replace, REPLACE_MODE_CURSOR_STYLE, REPLACE_MODE_STATUS_TEXT)
        ]

        //todo
        this._currentMode = this._modes.find(mode => ModeType.Normal === mode.type)!;

        this.setCurrentMode(ModeType.Normal);
    }

    get currentMode(): Mode {
        return this._currentMode;
    }

    setCurrentMode(type: ModeType) {
        this._currentMode = this._modes.find(mode => type === mode.type)!;
        this.onModeChangedEmitter.fire(this._currentMode);

        this.statusBar.setElement('vi-mode-status', {
            text: `--- ${this._currentMode.statusBarText} ---`,
            alignment: StatusBarAlignment.LEFT,
            priority: 2
        });
    }
}
