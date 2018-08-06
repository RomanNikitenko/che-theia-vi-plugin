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

export const NORMAL_MODE_STATUS_TEXT = 'NORMAL';
export const INSERT_MODE_STATUS_TEXT = 'INSERT';
export const VISUAL_MODE_STATUS_TEXT = 'VISUAL';
export const REPLACE_MODE_STATUS_TEXT = 'REPLACE';

export const NORMAL_MODE_CURSOR_STYLE = 'block';
export const INSERT_MODE_CURSOR_STYLE = 'line';
export const VISUAL_MODE_CURSOR_STYLE = 'block'; 
export const REPLACE_MODE_CURSOR_STYLE = 'underline'; 

export enum ModeType {
    Normal,
    Insert,
    Visual,
    Replace 
}

export class Mode {
    public readonly type: ModeType;
    public readonly cursorStyle: string;
    public readonly statusBarText: string;

    constructor(type: ModeType, cursorStyle: string, statusBarText: string) {
        this.type = type;
        this.cursorStyle = cursorStyle;
        this.statusBarText = statusBarText;
    }
}