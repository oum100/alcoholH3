# bun-express

This for parse hex string that returen from AlcohalH3 device support command
0x01: Read connection status
0x02: Read Device Infomation (Version, Battery, Language, TestMode, Unit)
0x03: Read Device Model
0x04: Read Device Serial Number
0x05: Read Latest time setting (setting time command 0x0A)
0x06: Read Latest record in device (auto incremental from command 0x07)
0x09: Read examination result
0x11: Read single record

Command syntax: BC FC <command> <dataLen> <data> <checksum mod 256>

To calculate checksum mod 256. Sum all data then the result mod with 256 = checksum value
Ex: <data> = 68 DF 3C 30
    sum = 06
    checksum = 1B3 % 256 = B3



To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
