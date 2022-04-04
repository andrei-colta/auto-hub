import {User} from './user';
import {Action} from './action';

export interface VideoCallSignal {
    from?: User;
    to?: number;
    conv_id?: number;
    content?: any;
    senderIsCompany?: boolean;
    action?: Action;
    sessionname? : any;
}
