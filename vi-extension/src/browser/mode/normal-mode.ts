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
import { MonacoEditor } from "@theia/monaco/lib/browser/monaco-editor";
import { ModeManager } from "./mode-manager";
import { ModeType } from "./mode";
import { EditorCommands } from "../editor-comands";

export namespace NormalModeCommands {
    export const CURSOR_RIGHT = {
        id: 'normal.mode.cursor.right',
        label: 'Move forward'
    }

    export const CURSOR_LEFT = {
        id: 'normal.mode.cursor.left',
        label: 'Move backward'
    }

    export const CURSOR_UP = {
        id: 'normal.mode.cursor.up',
        label: 'Move to the previous line'
    }

    export const CURSOR_DOWN = {
        id: 'normal.mode.cursor.down',
        label: 'Move to the next line'
    }

    export const CURSOR_HOME = {
        id: 'normal.mode.cursor.home',
        label: 'Move to the beginning of line'
    }

    export const CURSOR_END = {
        id: 'normal.mode.cursor.end',
        label: 'Move to the end of line'
    }

    export const CURSOR_WORD_END_RIGHT = {
        id: 'normal.mode.cursor.word.end.right',
        label: 'Move forward by one word unit'
    }

    export const CURSOR_WORD_START_LEFT = {
        id: 'normal.mode.cursor.word.start.left',
        label: 'Move backward by one word unit'
    }
}

@injectable()
export class NormalModeCommandContribution implements CommandContribution {

    @inject(ModeManager) protected readonly modeManager!: ModeManager;
    @inject(EditorManager) protected readonly editorManager!: EditorManager;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(NormalModeCommands.CURSOR_RIGHT, {
            execute: () => this.executeEditorCommand(EditorCommands.MOVE_CURSOR_RIGHT),
            isEnabled: () => this.isNormalModeActive()
        });

        registry.registerCommand(NormalModeCommands.CURSOR_LEFT, {
            execute: () => this.executeEditorCommand(EditorCommands.MOVE_CURSOR_LEFT),
            isEnabled: () => this.isNormalModeActive()
        });

        registry.registerCommand(NormalModeCommands.CURSOR_UP, {
            execute: () => this.executeEditorCommand(EditorCommands.MOVE_CURSOR_UP),
            isEnabled: () => this.isNormalModeActive()
        });

        registry.registerCommand(NormalModeCommands.CURSOR_DOWN, {
            execute: () => this.executeEditorCommand(EditorCommands.MOVE_CURSOR_DOWN),
            isEnabled: () => this.isNormalModeActive()
        });

        registry.registerCommand(NormalModeCommands.CURSOR_HOME, {
            execute: () => this.executeEditorCommand(EditorCommands.MOVE_CURSOR_HOME),
            isEnabled: () => this.isNormalModeActive()
        });

        registry.registerCommand(NormalModeCommands.CURSOR_END, {
            execute: () => this.executeEditorCommand(EditorCommands.MOVE_CURSOR_END),
            isEnabled: () => this.isNormalModeActive()
        });

        registry.registerCommand(NormalModeCommands.CURSOR_WORD_END_RIGHT, {
            execute: () => this.executeEditorCommand(EditorCommands.MOVE_CURSOR_WORD_END_RIGHT),
            isEnabled: () => this.isNormalModeActive()
        });

        registry.registerCommand(NormalModeCommands.CURSOR_WORD_START_LEFT, {
            execute: () => this.executeEditorCommand(EditorCommands.MOVE_CURSOR_WORD_START_LEFT),
            isEnabled: () => this.isNormalModeActive()
        });
    }

    private isNormalModeActive(): boolean {
        return this.modeManager.activeMode.type == ModeType.Normal;
    }

    private getEditor(): MonacoEditor | undefined {
        const editorWidget = this.editorManager.activeEditor!;
        const activeEditor = editorWidget.editor;

        return activeEditor instanceof MonacoEditor ? activeEditor as MonacoEditor : undefined;
    }

    private executeEditorCommand(commandId: string) {
        const editor = this.getEditor()!;
        editor.commandService.executeCommand(commandId);
    }
}