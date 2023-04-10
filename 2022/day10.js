const exampleInput = `noop
addx 3
addx -5`;

const largeExampleInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const realInput = `noop
noop
noop
addx 5
noop
addx 1
noop
addx 4
addx 25
addx -20
noop
noop
addx 5
addx 3
noop
addx 2
noop
noop
addx -1
addx 6
addx 1
noop
addx 4
noop
addx -37
noop
noop
noop
addx 3
addx 32
addx -25
addx 2
addx 3
noop
addx 2
addx 3
noop
addx 2
addx 2
addx -24
addx 25
addx 5
addx 2
addx 8
addx -23
addx 18
addx 5
addx -39
addx 11
addx -9
addx 6
addx -2
addx 5
addx 4
addx -4
addx 3
addx 5
addx 2
noop
addx -1
addx 6
addx -21
addx 22
addx 3
addx 1
addx 5
noop
noop
addx -35
noop
noop
noop
noop
addx 37
addx -33
noop
addx 6
addx 2
addx -1
addx 3
addx 1
addx 5
addx 2
addx -19
addx 21
addx 1
addx 5
addx -31
addx 36
noop
addx 3
addx -2
addx -38
noop
noop
addx 7
addx 14
addx -4
addx -7
addx 5
addx 2
addx 12
addx -15
addx 6
addx 2
addx 5
addx -27
addx 25
addx 5
noop
addx 7
addx -2
addx 5
addx -40
noop
addx 7
noop
addx -1
addx 2
addx 5
addx -1
addx 1
addx 2
addx 7
noop
addx -2
noop
addx 3
addx 2
addx 7
noop
noop
addx 1
noop
noop
addx 3
addx 1
noop
noop
noop`;

// const input = exampleInput;
// const input = largeExampleInput;
const input = realInput;

const regXValueAt = (state, cycle) => {
  return state.mem[cycle];
};

const startOf = (cycle) => `${cycle} A`;
const endOf = (cycle) => `${cycle} B`;

const work = input.split("\n").reduce(
  (state, row) => {
    const [op, arg] = row.split(" ");
    const { mem, cycle } = state;
    let opCost = 0;
    if (op === "addx") {
      mem[endOf(cycle + 1)] = arg;
      opCost = 2;
    } else if (op === "noop") {
      opCost = 1;
    } else {
      throw Error("unknown op: " + row);
    }

    return { mem, cycle: cycle + opCost };
  },
  { mem: {}, cycle: 1 }
);

const signalStrengthUpTil = (state, duringCycle) => {
  let x = 1;
  let s = "1 ";

  let lastKeySeen = "";
  for (const [key, value] of Object.entries(state.mem)) {
    lastKeySeen = key;
    // console.log("visiting", key, value);
    if (value === null) {
      continue;
    }
    const [cycleRaw, phase] = key.split(" ");
    const cycle = parseInt(cycleRaw, 10);
    if (cycle > duringCycle || (cycle === duringCycle && phase === "B")) {
      break;
    }
    if (cycle <= duringCycle) {
      const opValue = parseInt(value, 10);
      s += (opValue >= 0 ? "+ " : "") + opValue;
      x += opValue;
    }
  }
  // console.log("  stopped at", lastKeySeen);
  // console.log("  ", s);
  // console.log("  x =", x);
  return x * duringCycle;
};

const logStrengthOf = (state, cycle) =>
  console.log(`During ${cycle}th: `, signalStrengthUpTil(state, cycle));

const sortAndLogWork = (state, upTilCycle) => {
  console.log(
    Object.entries(state.mem)
      .slice(0, upTilCycle * 2)
      .sort((kv1, kv2) => kv1[0] < kv2[0])
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")
  );
};

const calcSumStrengthOf = (state, ...cycles) =>
  cycles.reduce((sum, item) => sum + signalStrengthUpTil(state, item), 0);

if (input === exampleInput) {
  sortAndLogWork(work, 6);
  logStrengthOf(work, 6);
} else {
  // sortAndLogWork(work, 20);
  logStrengthOf(work, 20);
  logStrengthOf(work, 60);
  logStrengthOf(work, 100);
  logStrengthOf(work, 140);
  logStrengthOf(work, 180);
  logStrengthOf(work, 220);
  console.log(
    "Total sum:",
    calcSumStrengthOf(work, 20, 60, 100, 140, 180, 220)
  );
}
