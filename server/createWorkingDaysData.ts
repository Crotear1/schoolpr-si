import { Nitro } from 'nitropack'
import mongoose, { Document } from 'mongoose';
import { WorkingDays } from '~/server/models/workingDaysModel';

export default async (_nitro: Nitro) => {
  const anyWorkingDaysExists = await WorkingDays.exists({});

  const days = [
    {
      name: 'Montag',
      code: 1,
      description: 'Schulstunde',
      isComplete: false,
      dates: { repeat: { weekdays: 2 },  },
      color: 'green',
    },
    {
      name: 'Dienstag',
      code: 2,
      description: 'Schulstunde',
      isComplete: false,
      dates: { repeat: { weekdays: 3 },  },
      color: 'green',
    },
    {
      name: 'Mittwoch',
      code: 3,
      description: 'Schulstunde',
      isComplete: false,
      dates: { repeat: { weekdays: 4 },  },
      color: 'green',
    },
    {
      name: 'Donnerstag',
      code: 4,
      description: 'Schulstunde',
      isComplete: false,
      dates: { repeat: { weekdays: 5 },  },
      color: 'green',
    },
    {
      name: 'Freitag',
      code: 5,
      description: 'Schulstunde',
      isComplete: false,
      dates: { repeat: { weekdays: 6 },  },
      color: 'green',
    },
  ];

  if (!anyWorkingDaysExists) {
    await WorkingDays.insertMany(days);

    return 'Neue WorkingDays-Einträge wurden erstellt.';
  } else {
    return 'WorkingDays existieren bereits. Keine weiteren Aktionen erforderlich.';
  }

}
