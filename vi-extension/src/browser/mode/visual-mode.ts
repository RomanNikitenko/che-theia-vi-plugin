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
import Selection = monaco.Selection;
import { EditorCommands } from "../editor-comands";

export namespace VisualModeCommands {
    export const SELECT_RIGHT = {
        id: 'visual.mode.select.right',
        label: 'Select Right'
    }

    export const SELECT_LEFT = {
        id: 'visual.mode.select.left',
        label: 'Select Left'
    }

    export const SELECT_UP = {
        id: 'visual.mode.select.up',
        label: 'Select Up'
    }

    export const SELECT_DOWN = {
        id: 'visual.mode.select.down',
        label: 'Select Down'
    }
}

export namespace VisualLineModeCommands {
    export const SELECT_UP = {
        id: 'visual.line.mode.select.up',
        label: 'Select Line Up'
    }

    export const SELECT_DOWN = {
        id: 'visual.line.mode.select.down',
        label: 'Select Line Down'
    }

    export const SELECT_LINE_HOME = {
        id: 'visual.line.mode.select.line.home',
        label: 'Select Line, set cursor at the beginning of the line'
    }

    export const DELETE_SELECTED = {
        id: 'visual.line.mode.delete',
        label: 'Delete selected lines'
    }
}

@injectable()
export class VisualModeCommandContribution implements CommandContribution {

    @inject(ModeManager) protected readonly modeManager!: ModeManager;
    @inject(EditorManager) protected readonly editorManager!: EditorManager;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(VisualModeCommands.SELECT_RIGHT, {
            execute: () => this.selectRight(),
            isEnabled: () => this.isVisualModeActive()
        });

        registry.registerCommand(VisualModeCommands.SELECT_LEFT, {
            execute: () => this.selectLeft(),
            isEnabled: () => this.isVisualModeActive()
        });

        registry.registerCommand(VisualModeCommands.SELECT_UP, {
            execute: () => this.selectUp(),
            isEnabled: () => this.isVisualModeActive()
        });

        registry.registerCommand(VisualModeCommands.SELECT_DOWN, {
            execute: () => this.selectDown(),
            isEnabled: () => this.isVisualModeActive()
        });

        registry.registerCommand(VisualLineModeCommands.SELECT_UP, {
            execute: () => this.selectLineUp(),
            isEnabled: () => this.isVisualLineModeActive()
        });

        registry.registerCommand(VisualLineModeCommands.SELECT_DOWN, {
            execute: () => this.selectLineDown(),
            isEnabled: () => this.isVisualLineModeActive()
        });

        registry.registerCommand(VisualLineModeCommands.SELECT_LINE_HOME, {
            execute: () => this.selectCurrentLine(),
            isEnabled: () => this.isVisualLineModeActive()
        });

        registry.registerCommand(VisualLineModeCommands.DELETE_SELECTED, {
            execute: () => {
                this.deleteLines();
                this.modeManager.setActiveMode(ModeType.Normal);
            },
            isEnabled: () => this.isVisualLineModeActive()
        });
    }

    private deleteLines() {
        this.executeEditorCommand(EditorCommands.DELETE_LINES);
    }

    private selectLeft() {
        const currentSelection = this.getCurrentSelection()!;
        const currentPosition = currentSelection.getPosition();

        this.changeSelection(currentSelection, currentPosition.lineNumber, currentPosition.column - 1);
    }

    private selectRight() {
        const currentSelection = this.getCurrentSelection()!;
        const currentPosition = currentSelection.getPosition();

        this.changeSelection(currentSelection, currentPosition.lineNumber, currentPosition.column + 1);
    }

    private selectUp() {
        const currentSelection = this.getCurrentSelection()!;
        const currentPosition = currentSelection.getPosition();

        this.changeSelection(currentSelection, currentPosition.lineNumber - 1, currentPosition.column);
    }

    private selectDown() {
        const currentSelection = this.getCurrentSelection()!;
        const currentPosition = currentSelection.getPosition();

        this.changeSelection(currentSelection, currentPosition.lineNumber + 1, currentPosition.column);
    }

    private selectCurrentLine() {
        const control = this.getEditor()!.getControl();
        const currentLineNumber = control.getPosition().lineNumber;
        const lineMaxColumn = control.getModel().getLineMaxColumn(currentLineNumber);

        control.setSelection({
            selectionStartLineNumber: currentLineNumber,
            selectionStartColumn: lineMaxColumn,
            positionLineNumber: currentLineNumber,
            positionColumn: 1
        });
    }

    private selectLineUp() {
        const control = this.getEditor()!.getControl();

        const currentSelection = this.getCurrentSelection()!;
        const currentSelectionStartLine = currentSelection.startLineNumber;
        const currentSelectionEndLine = currentSelection.endLineNumber;

        const direction = currentSelection.getDirection();
        const positionLineNumber = currentSelection.getPosition().lineNumber - 1
        const lineMaxColumn = control.getModel().getLineMaxColumn(positionLineNumber);

        const positionColumn = currentSelectionStartLine == currentSelectionEndLine || direction == 1 ? 1 : lineMaxColumn;
        const newSelectionStartLine = direction == 1 ? currentSelectionEndLine : currentSelectionStartLine;
        const newSelectionStartColumn = currentSelectionStartLine == currentSelectionEndLine || direction == 1 ? currentSelection.endColumn : 1;

        control.setSelection({
            selectionStartLineNumber: newSelectionStartLine,
            selectionStartColumn: newSelectionStartColumn,
            positionLineNumber: positionLineNumber,
            positionColumn: positionColumn
        });
        control.revealLine(positionLineNumber);
    }

    private selectLineDown() {
        const control = this.getEditor()!.getControl();

        const currentSelection = control.getSelection();
        const currentSelectionStartLine = currentSelection.startLineNumber;
        const currentSelectionEndLine = currentSelection.endLineNumber;

        const direction = currentSelection.getDirection();
        const positionLineNumber = currentSelection.getPosition().lineNumber + 1
        const lineMaxColumn = control.getModel().getLineMaxColumn(positionLineNumber);

        const positionColumn = currentSelectionStartLine != currentSelectionEndLine && direction == 1 ? 1 : lineMaxColumn;
        const newSelectionStartLine = direction == 1 ? currentSelectionEndLine : currentSelectionStartLine;
        const newSelectionStartColumn = currentSelectionStartLine != currentSelectionEndLine && direction == 1 ? currentSelection.endColumn : 1;

        control.setSelection({
            selectionStartLineNumber: newSelectionStartLine,
            selectionStartColumn: newSelectionStartColumn,
            positionLineNumber: positionLineNumber,
            positionColumn: positionColumn
        });
        control.revealLine(positionLineNumber);
    }

    private getCurrentSelection(): Selection | undefined {
        const editor = this.getEditor()!;
        return editor.getControl().getSelection();
    }

    /**
     * Change selection from start selection to given position.
     *  
     * @param positionLineNumber the line number on which the selection should be ended.
     * @param positionColumn the column on `positionLineNumber` where the selection should be ended.
	 */
    private changeSelection(currentSelection: Selection, positionLineNumber: number, positionColumn: number) {
        const direction = currentSelection.getDirection();

        const newSelectionStartLine = direction == 1 ? currentSelection.endLineNumber : currentSelection.startLineNumber;
        const newSelectionStartColumn = direction == 1 ? currentSelection.endColumn : currentSelection.startColumn;

        const editor = this.getEditor()!;
        editor.getControl().setSelection({
            selectionStartLineNumber: newSelectionStartLine,
            selectionStartColumn: newSelectionStartColumn,
            positionLineNumber: positionLineNumber,
            positionColumn: positionColumn
        });
        editor.getControl().revealLine(positionLineNumber);
    }

    private isVisualModeActive(): boolean {
        return this.modeManager.activeMode.type == ModeType.Visual;
    }

    private isVisualLineModeActive(): boolean {
        return this.modeManager.activeMode.type == ModeType.Visual_Line;
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