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
export const NORMAL_MODE_STATUS_TEXT = 'NORMAL';
export const INSERT_MODE_STATUS_TEXT = 'INSERT';
export const VISUAL_MODE_STATUS_TEXT = 'VISUAL';
export const VISUAL_LINE_MODE_STATUS_TEXT = 'VISUAL LINE';
export const REPLACE_MODE_STATUS_TEXT = 'REPLACE';

export const NORMAL_MODE_CURSOR_STYLE = 'block';
export const INSERT_MODE_CURSOR_STYLE = 'line';
export const VISUAL_MODE_CURSOR_STYLE = 'block';
export const REPLACE_MODE_CURSOR_STYLE = 'underline';

export const DEFAULT_CURSOR_BLINKING = 'blink';
export const VISUAL_LINE_MODE_CURSOR_BLINKING = 'solid';

export enum ModeType {
    Normal = 1,
    Insert,
    Visual,
    Visual_Line,
    Replace
}

export class Mode {
    public readonly cursorStyle: string;
    public readonly cursorBlinking?: string

    constructor(readonly type: ModeType, readonly statusBarText: string, editorOptions: { cursorStyle: string, cursorBlinking?: string }) {
        this.cursorStyle = editorOptions.cursorStyle;
        this.cursorBlinking = editorOptions.cursorBlinking ? editorOptions.cursorBlinking : DEFAULT_CURSOR_BLINKING;
    }
}