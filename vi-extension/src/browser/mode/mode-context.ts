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

// import { KeybindingContext, Keybinding } from "@theia/core/lib/browser";
import { injectable, inject } from "inversify";
import { ModeManager } from "./mode-manager";
import { ModeType } from "./mode";
import { EditorTextFocusContext, EditorWidget, EditorManager } from "@theia/editor/lib/browser";
import { KeybindingContext, Keybinding } from "@theia/core/lib/browser/keybinding";
import { SwitchModeCommands } from "./switch-mode";

export namespace ViModeKeybindingContexts {

    /**
     * ID of a keybinding context that is enabled when the current vi mode is Normal mode.
     */
    export const normalModeActive = 'viNormalModeActive';

    /**
     * ID of a keybinding context that is enabled when current vi mode can be switched.
     */
    export const switchMode = 'switchViMode';

    // export const insertModeActive = 'viInsertModeActive';
}

@injectable()
export class NormalModeContext extends EditorTextFocusContext {
    readonly id: string = ViModeKeybindingContexts.normalModeActive;

    constructor(@inject(ModeManager) protected readonly modeManager: ModeManager) {
        super();
    }

    protected canHandle(widget: EditorWidget): boolean {
        return super.canHandle(widget) && this.modeManager.currentMode.type == ModeType.Normal;
    }
}

@injectable()
export class SwitchModeContext implements KeybindingContext {
    readonly id: string = ViModeKeybindingContexts.switchMode;

    private switchToNormalModeCommands: string[] = [SwitchModeCommands.NORMAL_MODE.id];
    private switchToVisualModeCommands: string[] = [SwitchModeCommands.VISUAL_MODE.id];
    private switchToInsertModeCommands: string[] = [
        SwitchModeCommands.INSERT_MODE_CURSOR_AFTER.id,
        SwitchModeCommands.INSERT_MODE_CURSOR_BEFORE.id,
        SwitchModeCommands.INSERT_MODE_CURSOR_END.id,
        SwitchModeCommands.INSERT_MODE_CURSOR_HOME.id,
        SwitchModeCommands.INSERT_MODE_NEW_LINE_ABOVE.id,
        SwitchModeCommands.INSERT_MODE_NEW_LINE_BELOW.id
    ];

    constructor(@inject(ModeManager) protected readonly modeManager: ModeManager,
        @inject(EditorManager) protected readonly editorManager: EditorManager) { }

    isEnabled(keybinding: Keybinding): boolean {
        const command = keybinding.command!;
        const currentMode = this.modeManager.currentMode.type;
        if (this.isNormalModeCommand(command) && currentMode === ModeType.Normal) {
            return false;
        }

        if (this.isInsertModeCommand(command) && currentMode === ModeType.Insert) {
            return false;
        }

        if (this.isVisualModeCommand(command) && currentMode !== ModeType.Normal) {
            return false;
        }

        return this.isEditorFocused();
    }

    private isEditorFocused(): boolean {
        const widget = this.editorManager.activeEditor;
        return !!widget && widget.editor.isFocused();
    }

    private isNormalModeCommand(commandId: string): boolean {
        return this.switchToNormalModeCommands.indexOf(commandId) !== -1;
    }

    private isVisualModeCommand(commandId: string): boolean {
        return this.switchToVisualModeCommands.indexOf(commandId) !== -1;
    }

    private isInsertModeCommand(commandId: string): boolean {
        return this.switchToInsertModeCommands.indexOf(commandId) !== -1;
    }
}