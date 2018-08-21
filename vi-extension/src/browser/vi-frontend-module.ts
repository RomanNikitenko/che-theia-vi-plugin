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

import { ContainerModule } from "inversify";
import { CommandContribution } from "@theia/core/lib/common";
import { KeybindingContribution, KeybindingContext } from '@theia/core/lib/browser';
import { ViCommandContribution, ViKeybindingContribution } from './vi-contribution';
import { ModeManager } from "./mode/mode-manager";
import { NormalModeContext, SwitchModeContext, VisualModeContext, VisualLineModeContext } from "./mode/mode-context";
import { ViKeyBindings } from "./keybindings";
import { ViCommands } from "./commands";
import { TextEditorTracker } from "./editor-tracker";
import { SwitchViModeCommandContribution } from "./mode/switch-mode";
import { VisualModeCommandContribution } from "./mode/visual-mode";

export default new ContainerModule(bind => {

    bind(TextEditorTracker).toSelf().inSingletonScope();
    bind(ViCommands).toSelf().inSingletonScope();
    bind(ViKeyBindings).toSelf().inSingletonScope();



    bind(NormalModeContext);
    bind(KeybindingContext).to(NormalModeContext).inSingletonScope();
    bind(VisualModeContext);
    bind(KeybindingContext).to(VisualModeContext).inSingletonScope();
    bind(VisualLineModeContext);
    bind(KeybindingContext).to(VisualLineModeContext).inSingletonScope();
    bind(SwitchModeContext);
    bind(KeybindingContext).to(SwitchModeContext).inSingletonScope();
    bind(ModeManager).toSelf().inSingletonScope();

    bind(CommandContribution).to(ViCommandContribution);
    bind(CommandContribution).to(SwitchViModeCommandContribution);
    bind(CommandContribution).to(VisualModeCommandContribution);

    bind(KeybindingContribution).to(ViKeybindingContribution);
});