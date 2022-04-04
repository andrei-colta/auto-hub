import {User} from './user';
import {Action} from './action';

export interface Message {
    from?: string;
    to?: string;
    conv_id?: number;
    message?: any;
    senderIsCompany?: boolean;
    action?: Action;
    dt_send?: any;
    sameDay?: boolean;
}
