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

import { inject, injectable } from "inversify";
import { EditorManager } from "@theia/editor/lib/browser";
import { ModeManager } from "./mode/mode-manager";
import { Position } from 'vscode-languageserver-types';
import { Mode, ModeType } from "./mode/mode";
// import { MonacoEditor } from "@theia/monaco/lib/browser/monaco-editor";
import { StatusBar } from "@theia/core/lib/browser";
import { MonacoEditor } from "@theia/monaco/lib/browser/monaco-editor";

@injectable()
export class VisualModeHandler {
    constructor(@inject(StatusBar) protected readonly statusBar: StatusBar,
        @inject(EditorManager) protected readonly editorManager: EditorManager,
        @inject(ModeManager) protected readonly modeManager: ModeManager) {
        // editorManager.onCreated(editor => this.onEditorCreated(editor));
        modeManager.onModeChanged(newMode => this.onModeChanged(newMode));
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaa');
    }

    private onModeChanged(newMode: Mode) {
        console.log('ssssssssssssaaaaa');
        if (newMode.type !== ModeType.Visual) {
            return;
        }

        const editorWidget = this.editorManager.activeEditor!;
        const activeEditor = editorWidget.editor;

        if (activeEditor instanceof MonacoEditor) {
            const monacoEditor = activeEditor as MonacoEditor;
            console.log('!!!!!!! set fff selection !!!!!!!!');
            editorWidget.editor.onCursorPositionChanged(position => this.onCursorPositionChanged(position, monacoEditor));
        }
    }

    private onCursorPositionChanged(currentPosition: Position, editor: MonacoEditor) {
        console.log('============================= onCursorPositionChanged ' + editor.document.uri);
        const selection = editor.getControl().getSelection();
        
        // const selectionEnd = editor.selection.end;
        console.log('selection start ' + selection.startLineNumber + " /// " + selection.selectionStartColumn);
        // console.log('selection end ' + editor.selection.end.line + " /// " +  editor.selection.end.character);
        console.log('current ' + currentPosition.line + " /// " + currentPosition.character);
        console.log('position ' + selection.getPosition().lineNumber + " /// " + selection.getPosition().column);

        // console.log('selection ' + editor.getControl().getSelection().startLineNumber + " /// " + editor.getControl().getSelection().startColumn);
        

        editor.getControl().setSelection({
            startLineNumber: 0,
            startColumn: 0,
            endColumn: selection.getPosition().column,
            endLineNumber: selection.getPosition().lineNumber
        });

        // this.setSelectionStatus();
    }

    // private setSelectionStatus(): void {
    //     const selected = 10;
    //     this.statusBar.setElement('editor-selection-status', {
    //         text: `(${selected} selected)`,
    //         alignment: StatusBarAlignment.RIGHT,
    //         priority: 100
    //     });
    // }

    // private onEditorCreated(editorWidget: EditorWidget) {
    //     this.editors.add(editorWidget);
    //     editorWidget.disposed.connect(editor => this.onEditorRemoved(editorWidget));

    //     this.resolveCursorStyle(this.modeManager.currentMode.cursorStyle, editorWidget);
    // }

    // private onEditorRemoved(editorWidget: EditorWidget) {
    //     if (this.editors.has(editorWidget)) {
    //         this.editors.delete(editorWidget);
    //     }
    // }

    // private resolveCursorStyle(style: string, editorWidget: EditorWidget) {
    //     if (editorWidget.editor instanceof MonacoEditor) {
    //         const monacoEditor = editorWidget.editor as MonacoEditor;
    //         monacoEditor.getControl().updateOptions({ cursorStyle: style });
    //     }
    // }
}