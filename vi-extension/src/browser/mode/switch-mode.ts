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

import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry } from "@theia/core/lib/common/command";
// import MonacoSelection = monaco.Selection;
import { EditorManager } from "@theia/editor/lib/browser";
import { ModeManager } from "./mode-manager";
import { ModeType } from "./mode";
import { MonacoEditor } from "@theia/monaco/lib/browser/monaco-editor";

export namespace SwitchModeCommands {
    export const NORMAL_MODE = {
        id: 'vi.switch.to.normalMode',
        label: 'Switch to Normal Mode'
    }

    export const VISUAL_MODE = {
        id: 'vi.switch.to.visualMode',
        label: 'Switch to Visual Mode'
    }

    export const INSERT_MODE_CURSOR_BEFORE = {
        id: 'vi.switch.to.insertMode.cursorBefore',
        label: 'Switch to Insert Mode(cursor before)'
    }

    export const INSERT_MODE_CURSOR_AFTER = {
        id: 'vi.switch.to.insertMode.cursorAfter',
        label: 'Switch to Insert Mode(cursor after)'
    }

    export const INSERT_MODE_CURSOR_HOME = {
        id: 'vi.switch.to.insertMode.cursorHome',
        label: 'Switch to Insert Mode(cursor home)'
    }

    export const INSERT_MODE_CURSOR_END = {
        id: 'vi.switch.to.insertMode.cursorEnd',
        label: 'Switch to Insert Mode(cursor end)'
    }

    export const INSERT_MODE_NEW_LINE_BELOW = {
        id: 'vi.switch.to.insertMode.newLineBelow',
        label: 'Switch to Insert Mode(new line below)'
    }

    export const INSERT_MODE_NEW_LINE_ABOVE = {
        id: 'vi.switch.to.insertMode.newLineAbove',
        label: 'Switch to Insert Mode(new line above)'
    }
}

export namespace EditorCommands {
    export const MOVE_CURSOR_LEFT = 'cursorLeft';
    export const MOVE_CURSOR_RIGHT = 'cursorRight';
    export const MOVE_CURSOR_HOME = 'cursorHome';
    export const MOVE_CURSOR_END = 'cursorEnd';
    export const INSERT_LINE_ABOVE = 'editor.action.insertLineBefore';
    export const INSERT_LINE_BELOW = 'editor.action.insertLineAfter';
}

@injectable()
export class SwitchViModeCommandContribution implements CommandContribution {

    constructor(@inject(ModeManager) protected readonly modeManager: ModeManager,
        @inject(EditorManager) protected readonly editorManager: EditorManager
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(SwitchModeCommands.NORMAL_MODE, {
            execute: () => this.switchMode(EditorCommands.MOVE_CURSOR_LEFT, ModeType.Normal),
            isEnabled: () => this.modeManager.currentMode.type !== ModeType.Normal
        });

        registry.registerCommand(SwitchModeCommands.VISUAL_MODE, {
            execute: () => {
                this.switchMode(EditorCommands.MOVE_CURSOR_LEFT, ModeType.Visual);
                this.setStartPosition();
            },
            isEnabled: () => this.modeManager.currentMode.type === ModeType.Normal
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_CURSOR_BEFORE, {
            execute: () => this.modeManager.setCurrentMode(ModeType.Insert),
            isEnabled: () => this.modeManager.currentMode.type !== ModeType.Insert
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_CURSOR_AFTER, {
            execute: () => this.switchMode(EditorCommands.MOVE_CURSOR_RIGHT, ModeType.Insert),
            isEnabled: () => this.modeManager.currentMode.type !== ModeType.Insert
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_CURSOR_HOME, {
            execute: () => this.switchMode(EditorCommands.MOVE_CURSOR_HOME, ModeType.Insert),
            isEnabled: () => this.modeManager.currentMode.type !== ModeType.Insert
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_CURSOR_END, {
            execute: () => this.switchMode(EditorCommands.MOVE_CURSOR_END, ModeType.Insert),
            isEnabled: () => this.modeManager.currentMode.type !== ModeType.Insert
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_NEW_LINE_BELOW, {
            execute: () => this.switchMode(EditorCommands.INSERT_LINE_BELOW, ModeType.Insert),
            isEnabled: () => this.modeManager.currentMode.type !== ModeType.Insert
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_NEW_LINE_ABOVE, {
            execute: () => this.switchMode(EditorCommands.INSERT_LINE_ABOVE, ModeType.Insert),
            isEnabled: () => this.modeManager.currentMode.type !== ModeType.Insert
        });
    }

    private switchMode(commandId: string, modeType: ModeType) {
        this.executeEditorCommand(commandId);
        this.modeManager.setCurrentMode(modeType);
    }

    private executeEditorCommand(commandId: string) {
        const currentEditor = this.editorManager.currentEditor!;
        if (currentEditor.editor instanceof MonacoEditor) {
            const monacoEditor = currentEditor.editor as MonacoEditor;
            monacoEditor.commandService.executeCommand(commandId);
        }
    }

    private setStartPosition() {
        // console.log('!!!!!!! setStartPosition !!!!!!!!');
        // const currentEditor = this.editorManager.currentEditor!;
        // if (currentEditor.editor instanceof MonacoEditor) {
        //     const monacoEditor = currentEditor.editor as MonacoEditor;
        //     console.log('!!!!!!! set fff selection !!!!!!!!');
        //     monacoEditor.getControl().setSelection(MonacoSelection.createWithDirection(5, 10, 20, 7, monaco.SelectionDirection.LTR));
        //     // monacoEditor.getControl().setSelection({startLineNumber: 5, startColumn: 10, endColumn: 20, endLineNumber: 7});
        // }
    }
}