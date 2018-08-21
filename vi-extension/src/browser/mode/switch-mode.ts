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

import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry } from "@theia/core/lib/common/command";
import { EditorManager } from "@theia/editor/lib/browser";
import { ModeManager } from "./mode-manager";
import { ModeType } from "./mode";
import { MonacoEditor } from "@theia/monaco/lib/browser/monaco-editor";
import { VisualLineModeCommands } from "./visual-mode";
import { EditorCommands } from "../editor-comands";

export namespace SwitchModeCommands {
    export const NORMAL_MODE = {
        id: 'vi.switch.to.normalMode',
        label: 'Switch to Normal Mode'
    }

    export const VISUAL_MODE = {
        id: 'vi.switch.to.visualMode',
        label: 'Switch to Visual Mode'
    }

    export const VISUAL_LINE_MODE = {
        id: 'vi.switch.to.visualLineMode',
        label: 'Switch to Visual Line Mode'
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

@injectable()
export class SwitchViModeCommandContribution implements CommandContribution {

    constructor(@inject(ModeManager) protected readonly modeManager: ModeManager,
        @inject(EditorManager) protected readonly editorManager: EditorManager
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(SwitchModeCommands.NORMAL_MODE, {
            execute: () => {
                this.executeEditorCommand(EditorCommands.MOVE_CURSOR_LEFT);
                this.modeManager.setActiveMode(ModeType.Normal);
            },
            isEnabled: () => this.modeManager.isEnabled(ModeType.Normal)
        });

        registry.registerCommand(SwitchModeCommands.VISUAL_MODE, {
            execute: () => this.modeManager.setActiveMode(ModeType.Visual),
            isEnabled: () => this.modeManager.isEnabled(ModeType.Visual)
        });

        registry.registerCommand(SwitchModeCommands.VISUAL_LINE_MODE, {
            execute: () => {
                this.modeManager.setActiveMode(ModeType.Visual_Line);
                this.executeEditorCommand(VisualLineModeCommands.SELECT_LINE_HOME.id);
            },
            isEnabled: () => this.modeManager.isEnabled(ModeType.Visual_Line)
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_CURSOR_BEFORE, {
            execute: () => this.modeManager.setActiveMode(ModeType.Insert),
            isEnabled: () => this.modeManager.isEnabled(ModeType.Insert)
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_CURSOR_AFTER, {
            execute: () => {
                this.executeEditorCommand(EditorCommands.MOVE_CURSOR_RIGHT);
                this.modeManager.setActiveMode(ModeType.Insert);
            },

            isEnabled: () => this.modeManager.isEnabled(ModeType.Insert)
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_CURSOR_HOME, {
            execute: () => {
                this.executeEditorCommand(EditorCommands.MOVE_CURSOR_HOME);
                this.modeManager.setActiveMode(ModeType.Insert);
            },
            isEnabled: () => this.modeManager.isEnabled(ModeType.Insert)
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_CURSOR_END, {
            execute: () => {
                this.executeEditorCommand(EditorCommands.MOVE_CURSOR_END);
                this.modeManager.setActiveMode(ModeType.Insert);
            },
            isEnabled: () => this.modeManager.isEnabled(ModeType.Insert)
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_NEW_LINE_BELOW, {
            execute: () => {
                this.executeEditorCommand(EditorCommands.INSERT_LINE_BELOW);
                this.modeManager.setActiveMode(ModeType.Insert);
            },
            isEnabled: () => this.modeManager.isEnabled(ModeType.Insert)
        });

        registry.registerCommand(SwitchModeCommands.INSERT_MODE_NEW_LINE_ABOVE, {
            execute: () => {
                this.executeEditorCommand(EditorCommands.INSERT_LINE_ABOVE);
                this.modeManager.setActiveMode(ModeType.Insert);
            },
            isEnabled: () => this.modeManager.isEnabled(ModeType.Insert)
        });
    }

    private executeEditorCommand(commandId: string) {
        const currentEditor = this.editorManager.currentEditor!;
        if (currentEditor.editor instanceof MonacoEditor) {
            const monacoEditor = currentEditor.editor as MonacoEditor;
            monacoEditor.commandService.executeCommand(commandId);
        }
    }
}