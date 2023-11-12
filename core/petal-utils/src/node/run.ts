import { execFile as efCb } from 'node:child_process';
import { promisify } from 'node:util';

export const execFile = promisify(efCb);
