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
import { Keybinding } from "@theia/core/lib/browser";
import { injectable } from "inversify";

@injectable()
export class ViKeyBindings {
    private keyBindings: Keybinding[] = [];

    constructor() {
        this.keyBindings = [
            /*** Move commands ***/
            {
                command: 'cursorLeft',
                keybinding: "h",
                context: 'viNormalModeActive'
            },

            {
                command: 'cursorRight',
                keybinding: "l",
                context: 'viNormalModeActive'
            },

            {
                command: 'cursorUp',
                keybinding: "k",
                context: 'viNormalModeActive'
            },

            {
                command: 'cursorDown',
                keybinding: "j",
                context: 'viNormalModeActive'
            },

            {
                command: 'cursorHome',
                keybinding: "0",
                context: 'viNormalModeActive'
            },

            {
                command: 'cursorEnd',
                keybinding: "shift+4",//$
                context: 'viNormalModeActive'
            },

            {
                command: 'cursorWordStartLeft',
                keybinding: "b",
                context: 'viNormalModeActive'
            },

            {
                command: 'cursorWordEndRight',
                keybinding: "e",
                context: 'viNormalModeActive'
            },

            /*** Switch vi mode commands ***/
            {
                command: 'vi.switch.to.normalMode',
                keybinding: "esc",
                context: 'switchViMode'
            },

            {
                command: 'vi.switch.to.normalMode',
                keybinding: "ctrl+[",
                context: 'switchViMode'
            },

            {
                command: 'vi.switch.to.visualMode',
                keybinding: "v",
                context: 'switchViMode'
            },

            {
                command: 'vi.switch.to.insertMode.cursorBefore',
                keybinding: "i",
                context: 'switchViMode'
            },

            {
                command: 'vi.switch.to.insertMode.cursorBefore',
                keybinding: "ins",
                context: 'switchViMode'
            },

            {
                command: 'vi.switch.to.insertMode.cursorAfter',
                keybinding: "a",
                context: 'switchViMode'
            },

            {
                command: 'vi.switch.to.insertMode.newLineBelow',
                keybinding: "o",
                context: 'switchViMode'
            },

            {
                command: 'vi.switch.to.insertMode.cursorHome',
                keybinding: "shift+i",
                context: 'switchViMode'
            },

            {
                command: 'vi.switch.to.insertMode.cursorEnd',
                keybinding: "shift+a",
                context: 'switchViMode'
            },

            {
                command: 'vi.switch.to.insertMode.newLineAbove',
                keybinding: "shift+o",
                context: 'switchViMode'
            },
        ]
    }

    getKeybindingsForCommand(commandId: string): Keybinding[] {
        const result: Keybinding[] = [];
        for (const keybinding of this.keyBindings) {
            if (keybinding.command === commandId) {
                result.push({
                    command: keybinding.command,
                    keybinding: keybinding.keybinding,
                    context: keybinding.context
                });
            }
        }
        return result;
    }

    getKeybindings(): Keybinding[] {
        return Array.from(this.keyBindings);
    }
}