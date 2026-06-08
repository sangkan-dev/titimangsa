import {
  addWorkdays,
  checkWorkday,
  diffWorkdays,
  type WorkdayDiffOptions,
  type WorkdayOptions,
} from "@sangkan-dev/titimangsa";

export type WorkdayCheckQuery = {
  date: string;
  includeCollectiveLeave: boolean;
  weekend?: string;
};

export type WorkdayAddQuery = WorkdayCheckQuery & {
  days: number;
};

export type WorkdayDiffQuery = {
  start: string;
  end: string;
  includeCollectiveLeave: boolean;
  weekend?: string;
  inclusive: boolean;
};

export function getWorkdayCheck(options: WorkdayCheckQuery) {
  return {
    meta: {
      year: Number(options.date.slice(0, 4)),
    },
    data: checkWorkday(options.date, toWorkdayOptions(options)),
  };
}

export function getWorkdayAdd(options: WorkdayAddQuery) {
  return {
    meta: {},
    data: addWorkdays(options.date, options.days, toWorkdayOptions(options)),
  };
}

export function getWorkdayDiff(options: WorkdayDiffQuery) {
  const workdayOptions: WorkdayDiffOptions = {
    includeCollectiveLeave: options.includeCollectiveLeave,
    inclusive: options.inclusive,
    ...(options.weekend ? { weekend: options.weekend } : {}),
  };

  return {
    meta: {},
    data: diffWorkdays(options.start, options.end, workdayOptions),
  };
}

function toWorkdayOptions(options: WorkdayCheckQuery): WorkdayOptions {
  return {
    includeCollectiveLeave: options.includeCollectiveLeave,
    ...(options.weekend ? { weekend: options.weekend } : {}),
  };
}
