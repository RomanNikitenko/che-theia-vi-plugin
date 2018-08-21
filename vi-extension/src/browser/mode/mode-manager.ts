/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which is available at http://www.eclipse.org/legal/epl-2.0.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import {
    Mode, ModeType,
    INSERT_MODE_STATUS_TEXT,
    VISUAL_MODE_STATUS_TEXT,
    VISUAL_LINE_MODE_STATUS_TEXT,
    NORMAL_MODE_STATUS_TEXT,
    REPLACE_MODE_STATUS_TEXT,
    NORMAL_MODE_CURSOR_STYLE,
    INSERT_MODE_CURSOR_STYLE,
    VISUAL_MODE_CURSOR_STYLE,
    REPLACE_MODE_CURSOR_STYLE,
    VISUAL_LINE_MODE_CURSOR_BLINKING

} from "./mode";
import { injectable, inject } from "inversify";
import { StatusBar, StatusBarAlignment } from "@theia/core/lib/browser";
import { Event, Emitter } from "@theia/core";
import { EditorManager } from "@theia/editor/lib/browser";

@injectable()
export class ModeManager {
    private _modes: Mode[];
    private _activeMode!: Mode;

    private onModeChangedEmitter = new Emitter<Mode>();
    onModeChanged: Event<Mode> = this.onModeChangedEmitter.event;

    constructor(@inject(StatusBar) protected readonly statusBar: StatusBar,
        @inject(EditorManager) protected readonly editorManager: EditorManager) {

        this._modes = [
            new Mode(ModeType.Normal, NORMAL_MODE_STATUS_TEXT, { cursorStyle: NORMAL_MODE_CURSOR_STYLE }),
            new Mode(ModeType.Insert, INSERT_MODE_STATUS_TEXT, { cursorStyle: INSERT_MODE_CURSOR_STYLE }),
            new Mode(ModeType.Visual, VISUAL_MODE_STATUS_TEXT, { cursorStyle: VISUAL_MODE_CURSOR_STYLE, cursorBlinking: VISUAL_LINE_MODE_CURSOR_BLINKING }),
            new Mode(ModeType.Visual_Line, VISUAL_LINE_MODE_STATUS_TEXT, { cursorStyle: VISUAL_MODE_CURSOR_STYLE }),
            new Mode(ModeType.Replace, REPLACE_MODE_STATUS_TEXT, { cursorStyle: REPLACE_MODE_CURSOR_STYLE })
        ]

        this.setActiveMode(ModeType.Normal);
    }

    get activeMode(): Mode {
        return this._activeMode;
    }

    setActiveMode(type: ModeType) {
        this._activeMode = this._modes.find(mode => type === mode.type)!;
        this.onModeChangedEmitter.fire(this._activeMode);

        this.statusBar.setElement('vi-mode-status', {
            text: `--- ${this._activeMode.statusBarText} ---`,
            alignment: StatusBarAlignment.LEFT,
            priority: 2
        });
    }

    isActive(type: ModeType): boolean {
        return this._activeMode.type === type;
    }

    isEnabled(type: ModeType): boolean {
        if (!this.isEditorFocused()) {
            return false;
        }

        const activeModeType = this._activeMode.type;
        switch (type) {
            case ModeType.Normal:
                return activeModeType !== ModeType.Normal;
            case ModeType.Insert:
                return activeModeType !== ModeType.Insert;
            case ModeType.Visual:
                return activeModeType === ModeType.Normal
                    || activeModeType === ModeType.Visual_Line;
            case ModeType.Visual_Line:
                return activeModeType === ModeType.Normal
                    || activeModeType === ModeType.Visual;
            default:
                return false;
        }
    }

    private isEditorFocused(): boolean {
        const widget = this.editorManager.activeEditor;
        return !!widget && widget.editor.isFocused();
    }
}
