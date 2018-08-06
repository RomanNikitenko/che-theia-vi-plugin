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

import { ContainerModule } from "inversify";
import { CommandContribution } from "@theia/core/lib/common";
import { KeybindingContribution, KeybindingContext } from '@theia/core/lib/browser';
import { ViCommandContribution, ViKeybindingContribution } from './vi-contribution';
import { ModeManager } from "./mode/mode-manager";
// import { ActionsRegistry, NormalModeAction, InsertModeAction } from "./actions";
import { NormalModeContext, SwitchModeContext } from "./mode/mode-context";
import { ViKeyBindings } from "./keybindings";
import { ViCommands } from "./commands";
import { TextEditorTracker } from "./editor-tracker";
import { SwitchViModeCommandContribution } from "./mode/switch-mode";
import { VisualModeHandler } from "./visual-mode-handler";

export default new ContainerModule(bind => {

    bind(VisualModeHandler).toSelf().inSingletonScope();
    bind(TextEditorTracker).toSelf().inSingletonScope();
    // bind(ActionsRegistry).toSelf().inSingletonScope();
    // bind(NormalModeAction).toSelf().inSingletonScope();
    // bind(InsertModeAction).toSelf().inSingletonScope();
    bind(ViCommands).toSelf().inSingletonScope();
    bind(ViKeyBindings).toSelf().inSingletonScope();


    
    bind(NormalModeContext);
    bind(KeybindingContext).to(NormalModeContext).inSingletonScope();
    bind(SwitchModeContext);
    bind(KeybindingContext).to(SwitchModeContext).inSingletonScope();
    bind(ModeManager).toSelf().inSingletonScope();
    
    bind(CommandContribution).to(ViCommandContribution);
    bind(CommandContribution).to(SwitchViModeCommandContribution);
    
    bind(KeybindingContribution).to(ViKeybindingContribution);
});