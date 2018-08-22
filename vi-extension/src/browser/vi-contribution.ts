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
import { MonacoCommandRegistry } from '@theia/monaco/lib/browser/monaco-command-registry';
import { KeybindingContribution, KeybindingRegistry, StatusBar, KeyCode, StatusBarAlignment, Keybinding, KeybindingScope, KeySequence } from '@theia/core/lib/browser';
import { CommandContribution, CommandRegistry } from "@theia/core/lib/common";
import { ModeManager } from "./mode/mode-manager";
import { ViKeyBindings } from "./keybindings";
import { ViCommands } from "./commands";
import { ModeType } from "./mode/mode";
import { EditorManager } from "@theia/editor/lib/browser";
import { TextEditorTracker } from "./editor-tracker";

@injectable()
export class ViCommandContribution implements CommandContribution {

    constructor(@inject(MonacoCommandRegistry) protected readonly monacoCommandRegistry: MonacoCommandRegistry,
        @inject(StatusBar) protected readonly statusBar: StatusBar,
        @inject(ViCommands) protected readonly viCommands: ViCommands,
        @inject(EditorManager) protected readonly editorManager: EditorManager,
        @inject(ModeManager) protected readonly modeManager: ModeManager,
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
        @inject(ModeManager) protected readonly modeManager: ModeManager,
        @inject(KeybindingRegistry) protected readonly keybindingRegistry: KeybindingRegistry,
        @inject(CommandRegistry) protected readonly commandRegistry: CommandRegistry,
        @inject(EditorManager) protected readonly editorManager: EditorManager,
        @inject(ViKeyBindings) protected readonly viKeyBindings: ViKeyBindings) {
        document.addEventListener('keydown', event => this.handleKeyboardEvant(event), true);
        this.statusBar.removeElement('hotkey-status');
    }

    registerKeybindings(registry: KeybindingRegistry): void {
        const viKeyBindingList: Keybinding[] = [];
        for (const item of this.viKeyBindings.getKeybindings()) {
            const commandId = this.monacoCommandRegistry.validate(item.command);
            if (commandId) {
                item.command = commandId;
            }

            viKeyBindingList.push(item);
        }

        if (viKeyBindingList.length > 0) {
            registry.setKeymap(KeybindingScope.USER, viKeyBindingList);
        }
    }

    private handleKeyboardEvant(event: KeyboardEvent) {
        if (event.defaultPrevented) {
            return;
        }

        const keyCode = KeyCode.createKeyCode(event);
        if (keyCode.isModifierOnly()) {
            return;
        }

        this.statusBar.setElement('hotkey-status', {
            text: `--- ${keyCode} ---`,
            alignment: StatusBarAlignment.LEFT,
            priority: 2
        });

        this.keySequence.push(keyCode);

        if (this.isEditorFocused && this.modeManager.activeMode.type != ModeType.Insert) {
            const bindingsResult = this.keybindingRegistry.getKeybindingsForKeySequence(this.keySequence);
            if (!this.hasActiveHandlerFor(bindingsResult.full)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        this.keySequence = [];
    }

    private hasActiveHandlerFor(bindings: Keybinding[]): boolean {
        for (const binding of bindings) {
            if (this.commandRegistry.isEnabled(binding.command)) {
                return true;
            }
        }
        return false;
    }

    private isEditorFocused(): boolean {
        const widget = this.editorManager.activeEditor;
        return !!widget && widget.editor.isFocused();
    }
}