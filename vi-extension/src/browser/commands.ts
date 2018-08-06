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
import { injectable } from "inversify";
import { Command } from "@theia/core";

@injectable()
export class ViCommands {
    private commands = [
        {
            id: 'cursorLeft',
            label: 'Move backward'
        },

        {
            id: 'editor.action.moveCarretRightAction',
            label: 'Move forward'
        },

        {
            id: 'cursorRight',
            label: 'Move forward'
        },

        {
            id: 'cursorUp',
            label: 'Move to the previous line'
        },

        {
            id: 'cursorDown',
            label: 'Move to the next line'
        },

        {
            id: 'cursorHome',
            label: "Move to the beginning of line"
        },

        {
            id: 'cursorEnd',
            label: "Move to the end of line"
        },

        {
            id: 'cursorWordEndRight',
            label: "Move forward by one word unit"
        },

        {
            id: 'cursorWordStartLeft',
            label: "Move backward by one word unit"
        },

        {
            id: 'cursorBottom',
            label: "Move to the end of buffer"
        },

        {
            id: 'cursorTop',
            label: "Move to the beginning of buffer"
        },

        {
            id: 'cursorPageDown',
            label: "Scroll down by one screen unit"
        },

        {
            id: 'cursorPageUp',
            label: "Scroll up by one screen unit"
        },

        {
            id: 'editor.action.gotoLine',
            label: "Jump to line"
        },

        {
            id: 'editor.action.nextMatchFindAction',
            label: "Search forward"
        },

        {
            id: 'editor.action.previousMatchFindAction',
            label: "Search backward"
        },

        {
            id: 'editor.action.addSelectionToNextFindMatch',
            label: "Add selection to next find match"
        },

        {
            id: 'deleteRight',
            label: "Delete right (DEL)"
        },

        {
            id: 'deleteLeft',
            label: "Delete left (BACKSPACE)"
        },

        {
            id: 'deleteWordRight',
            label: "Delete word"
        },

        {
            id: 'deleteAllRight',
            label: "Kill to line end"
        },

        {
            id: 'editor.action.insertLineAfter',
            label: "Insert Line Below"
        },

        {
            id: 'undo',
            label: "Undo"
        },

        {
            id: 'editor.action.commentLine',
            label: "Toggle line comment in and out"
        },

        {
            id: 'editor.action.blockComment',
            label: "Toggle region comment in and out"
        }
    ]

    getCommands(): Command[] {
        return Array.from(this.commands);
    }
}