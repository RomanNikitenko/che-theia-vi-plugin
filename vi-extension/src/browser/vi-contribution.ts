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
import { MonacoCommandRegistry } from '@theia/monaco/lib/browser/monaco-command-registry';
import { KeybindingContribution, KeybindingRegistry, StatusBar, KeyCode, StatusBarAlignment, Keybinding, KeybindingScope, KeySequence } from '@theia/core/lib/browser';
import { CommandContribution, CommandRegistry } from "@theia/core/lib/common";
import { ModeManager } from "./mode/mode-manager";
// import { ModeType } from "./mode/mode";
// import { Mode, ModeType } from "./mode/mode";
import { ViKeyBindings } from "./keybindings";
import { ViCommands } from "./commands";
import { ModeType } from "./mode/mode";
import { EditorManager } from "@theia/editor/lib/browser";
import { TextEditorTracker } from "./editor-tracker";
import { VisualModeHandler } from "./visual-mode-handler";

@injectable()
export class ViCommandContribution implements CommandContribution {

    constructor(@inject(MonacoCommandRegistry) protected readonly monacoCommandRegistry: MonacoCommandRegistry,
        @inject(StatusBar) protected readonly statusBar: StatusBar,
        @inject(ViCommands) protected readonly viCommands: ViCommands,
        @inject(EditorManager) protected readonly editorManager: EditorManager,
        @inject(ModeManager) protected readonly modeManager: ModeManager,
        @inject(VisualModeHandler) protected readonly visualModeHandler: VisualModeHandler,
        @inject(TextEditorTracker) protected readonly textEditorTracker: TextEditorTracker
    ) { }

    registerCommands(registry: CommandRegistry): void {
        this.viCommands.getCommands().forEach(command => {
            const commandId = command.id;
            const monacoCommand = this.monacoCommandRegistry.validate(commandId);
            if (!monacoCommand && !registry.getCommand(commandId)) {
                this.monacoCommandRegistry.registerCommand({ 'id': commandId, 'label': command.label }, {
                    execute: editor => editor.commandService.executeCommand(commandId)
                });
            }
        });
    }
}

@injectable()
export class ViKeybindingContribution implements KeybindingContribution {
    protected keySequence: KeySequence = [];

    constructor(@inject(MonacoCommandRegistry) protected readonly monacoCommandRegistry: MonacoCommandRegistry,
        @inject(StatusBar) protected readonly statusBar: StatusBar,
        @inject(ModeManager) protected readonly modeHolder: ModeManager,
        @inject(KeybindingRegistry) protected readonly keybindingRegistry: KeybindingRegistry,
        @inject(EditorManager) protected readonly editorManager: EditorManager,
        @inject(ViKeyBindings) protected readonly viKeyBindings: ViKeyBindings) {
        document.addEventListener('keydown', event => this.handleKeyboardEvant(event), true);
        this.statusBar.removeElement('hotkey-status');
    }

    registerKeybindings(registry: KeybindingRegistry): void {
        const emacsKeyBindingList: Keybinding[] = [];
        for (const item of this.viKeyBindings.getKeybindings()) {
            const commandId = this.monacoCommandRegistry.validate(item.command);
            if (commandId) {
                item.command = commandId;
            }

            emacsKeyBindingList.push(item);
        }

        if (emacsKeyBindingList.length > 0) {
            registry.setKeymap(KeybindingScope.USER, emacsKeyBindingList);
        }
    }

    private handleKeyboardEvant(event: KeyboardEvent) {
        console.log('===========================================');
        // console.log('editor.action.insertLineAfter' + this.keybindingRegistry.getKeybindingsForCommand('monaco.editor.action.insertLineAfter')[0].keybinding);
        // console.log('press ' + event.ctrlKey + " /// " + event.key);

        if (event.defaultPrevented) {
            console.log('RETURN 1 ');
            return;
        }

        const keyCode = KeyCode.createKeyCode(event);
        if (keyCode.isModifierOnly()) {
            console.log('RETURN 2 ');
            return;
        }

        this.statusBar.setElement('hotkey-status', {
            text: `--- ${keyCode} ---`,
            alignment: StatusBarAlignment.LEFT,
            priority: 2
        });

        // const action = this.actionRegistry.getRelevantAction(keyCode);
        // if (action) {
        //     action.performe(event);
        //     console.log('=== perform action = return ');
        //     return;
        // }


        console.log('push keycode ' + keyCode);
        this.keySequence.push(keyCode);

        if (this.modeHolder.currentMode.type == ModeType.Normal) {

            for (const r of this.keySequence) {
                console.log('=== ' + r);
            }
            const bindings = this.keybindingRegistry.getKeybindingsForKeySequence(this.keySequence);

            if (bindings.full.length === 0) {
                event.preventDefault();
                event.stopPropagation();

                console.log('RETURN = ModeType.Normal');
            }


        }

        console.log('clean');
        this.keySequence = [];

        // const iKeyCode = KeyCode.parse('i');
        // if (iKeyCode.equals(keyCode)) {

        //     // event.preventDefault();
        //     // event.stopPropagation();

        //     this.modeHandler.setCurrentMode(ModeType.Insert);

        //     console.log('STOP ' + this.modeHandler.currentMode.statusBarText);
        // } else {
        //     // event.preventDefault();
        //     // event.stopPropagation();

        //     this.modeHandler.setCurrentMode(ModeType.Command);

        //     console.log('NOT stop ' + this.modeHandler.currentMode.statusBarText);
        // }



        // this.statusBar.setElement('mode-status', {
        //     text: `--- ${this.modeHandler.currentMode.statusBarText} ---`,
        //     alignment: StatusBarAlignment.LEFT,
        //     priority: 2
        // });
    }
}