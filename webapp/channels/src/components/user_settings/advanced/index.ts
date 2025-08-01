// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import type {Dispatch} from 'redux';

import {savePreferences} from 'mattermost-redux/actions/preferences';
import {updateUserActive, revokeAllSessionsForUser} from 'mattermost-redux/actions/users';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {
    get,
    getUnreadScrollPositionPreference,
    makeGetCategory, makeGetUserCategory,
    syncedDraftsAreAllowed,
} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {Preferences} from 'utils/constants';

import type {GlobalState} from 'types/store';

import type {OwnProps} from './user_settings_advanced';
import AdvancedSettingsDisplay from './user_settings_advanced';

function makeMapStateToProps(state: GlobalState, props: OwnProps) {
    const getAdvancedSettingsCategory = props.adminMode ? makeGetUserCategory(props.user.id) : makeGetCategory();

    return (state: GlobalState, props: OwnProps) => {
        const config = getConfig(state);

        const enablePreviewFeatures = config.EnablePreviewFeatures === 'true';
        const enableUserDeactivation = config.EnableUserDeactivation === 'true';
        const enableJoinLeaveMessage = config.EnableJoinLeaveMessageByDefault === 'true';

        const userPreferences = props.adminMode && props.userPreferences ? props.userPreferences : undefined;

        return {
            advancedSettingsCategory: getAdvancedSettingsCategory(state, Preferences.CATEGORY_ADVANCED_SETTINGS),
            sendOnCtrlEnter: get(state, Preferences.CATEGORY_ADVANCED_SETTINGS, 'send_on_ctrl_enter', 'false', userPreferences),
            codeBlockOnCtrlEnter: get(state, Preferences.CATEGORY_ADVANCED_SETTINGS, 'code_block_ctrl_enter', 'true', userPreferences),
            formatting: get(state, Preferences.CATEGORY_ADVANCED_SETTINGS, 'formatting', 'true', userPreferences),
            joinLeave: get(state, Preferences.CATEGORY_ADVANCED_SETTINGS, 'join_leave', enableJoinLeaveMessage.toString(), userPreferences),
            syncDrafts: get(state, Preferences.CATEGORY_ADVANCED_SETTINGS, 'sync_drafts', 'true', userPreferences),
            user: props.adminMode && props.user ? props.user : getCurrentUser(state),
            unreadScrollPosition: getUnreadScrollPositionPreference(state, userPreferences),
            enablePreviewFeatures,
            enableUserDeactivation,
            syncedDraftsAreAllowed: syncedDraftsAreAllowed(state),
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators({
            savePreferences,
            updateUserActive,
            revokeAllSessionsForUser,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(AdvancedSettingsDisplay);
