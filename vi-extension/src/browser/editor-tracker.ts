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
import { EditorManager, EditorWidget } from "@theia/editor/lib/browser";
import { ModeManager } from "./mode/mode-manager";
import { Mode } from "./mode/mode";
import { MonacoEditor } from "@theia/monaco/lib/browser/monaco-editor";

@injectable()
export class TextEditorTracker {
    private editors = new Set<EditorWidget>();

    constructor(@inject(EditorManager) protected readonly editorManager: EditorManager,
        @inject(ModeManager) protected readonly modeManager: ModeManager) {
        editorManager.onCreated(editor => this.onEditorCreated(editor));
        modeManager.onModeChanged(newMode => this.onModeChanged(newMode));
    }

    private onModeChanged(newMode: Mode) {
        for (const editor of this.editors) {
            this.resolveCursorStyle(newMode.cursorStyle, editor);
        }
    }

    private onEditorCreated(editorWidget: EditorWidget) {
        this.editors.add(editorWidget);
        editorWidget.disposed.connect(editor => this.onEditorRemoved(editorWidget));

        this.resolveCursorStyle(this.modeManager.currentMode.cursorStyle, editorWidget);
    }

    private onEditorRemoved(editorWidget: EditorWidget) {
        if (this.editors.has(editorWidget)) {
            this.editors.delete(editorWidget);
        }
    }

    private resolveCursorStyle(style: string, editorWidget: EditorWidget) {
        if (editorWidget.editor instanceof MonacoEditor) {
            const monacoEditor = editorWidget.editor as MonacoEditor;
            monacoEditor.getControl().updateOptions({ cursorStyle: style });
        }
    }
}