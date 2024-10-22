# BRC333 Satplications: Dynamic Ordinals on Bitcoin

### Overview
BRC333 satplications enable interactive and evolving Bitcoin ordinals by leveraging **Digital Matter Theory (DMT)**, recursive inscriptions, and **designated sats**. This modular system allows dynamic content creation, RPG mechanics, and future-proof updates through **reinscriptions**.

---

## Key Features
- **Modular, Loadable Components**: Scripts are modular and loadable into multiple projects.
- **Pixel/SVG Support**: Create flexible, interactive visuals with pixel coordinates and vector art.
- **Power Values (0-10)**: Integrate RPG-style powers into ordinals.
- **Pako.js Compression**: Optimizes logic for reduced block space usage.
- **Time Travel Ready**: Explore how ordinals evolve across historical blocks.

---

## Repository Structure

```
BRC333_Satplications/
│
├── bitcoin/  
│   ├── BRC333oracle_m.js  
│   ├── BRC333timetravel_m.js  
│   ├── BRC333ui_m.js  
│   ├── BRC333utils_m.js  
│   └── BRC333dmt_m.js  
│
├── goblins/  
│   ├── json/  
│   │   ├── src_prod.json  
│   │   ├── oracleDemo.json  
│   │   ├── oracleDemoTrait.json  
│   │   └── timeTravelDemo.json  
│   ├── ng_prod.js  
│   └── decompress/  
│       └── ng_prod.htm  
```

---

## Modules Overview

1. **ng_prod.htm**  
   - Main HTML entry point for the NatGoblin satplication.
   - Integrates modules for **UI, interactive features, and moon phase coordination**.

2. **BRC333oracle_m.js**  
   - Manages **oracle messaging** that responds to **block heights, offsets, and events**.

3. **BRC333timetravel_m.js**  
   - Implements time-based logic, allowing **reinscription-based updates** and exploration of ordinals’ past states.

4. **BRC333ui_m.js**  
   - Controls **interactive elements**, such as modals, background changes, and time selectors.

5. **BRC333utils_m.js**  
   - Provides **utility functions** for trait management, moon phase calculations, and DMT integration.

6. **BRC333dmt_m.js**  
   - Handles **trait scoring, SVG rendering, and power assignments** for ordinals.

7. **ng_prod.js**  
   - **Core logic** for the NatGoblin collection, coordinating **DNA-based traits** and **RPG elements** with moon synchronization.

---

## Detailed Instructions for Oracle and Time Travel Configurations

### Oracle Configurations

Example from **oracleDemoTrait.json**:

```json
{
  "protocol": "BRC333",
  "operation": "oracle",
  "description": "This is an oracle demo for the BRC333 protocol on Fractal Bitcoin.",
  "messages": [
    {
      "id": "welcome",
      "action": "add",
      "offset": 100,
      "link": "https://brc333.xyz",
      "message": "The NatGoblin Oracle whispers: Welcome, Brown Wolf! The night favors your hunt.",
      "project": "Brown Wolf"
    },
    {
      "id": "update_test",
      "action": "add",
      "offset": 100,
      "stop": 110,
      "message": "White Wolf, the moon beckons you!",
      "project": "White Wolf"
    },
    {
      "id": "900000",
      "action": "add",
      "block": 900000,
      "link": "https://brc333.xyz",
      "message": "Block 900,000 has arrived! With it comes the whispers of change."
    }
  ]
}
```

---

### Time Travel Configurations

Example from **timeTravelDemo.json**:

```json
{
  "timetravel": [
    {
      "id": "moon_phase_change",
      "block": 888888,
      "action": "replace",
      "target": "background",
      "value": "full_moon"
    },
    {
      "id": "unveil_traits",
      "block": 900000,
      "action": "add",
      "target": "rare_traits",
      "value": "uncovered"
    },
    {
      "id": "lock_traits",
      "offset": 1000,
      "stop": 1100,
      "action": "replace",
      "target": "traits",
      "value": "common_only"
    }
  ]
}
```

---

## How to Run the Application Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Bridgit-SPC/brc333/
   cd brc333
   ```

2. **Open ng_prod.htm** to access the NatGoblin interface.

3. **Compressed Logic**: Scripts use **Pako.js** for block space optimization.

---

## How to Contribute

Submit issues and pull requests through GitHub.

---

## Resources

- [BRC333 Protocol](https://brc333.xyz)  
- [Pachaverse](https://pachaverse.io)

---

## License

Licensed under the **GPL-3.0 License**.

---

## Credits

Thanks to **Shiftshapr** and the BRC333 community for building the NatGoblin satplication.