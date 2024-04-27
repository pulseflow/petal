import { execFile as efCb } from 'node:child_process';
import { promisify } from 'node:util';

// todo: use execa minimal
export const execFile = promisify(efCb);
