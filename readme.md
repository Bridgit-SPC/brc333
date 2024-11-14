# **BRC333 Satplications: Dynamic Ordinals on Bitcoin**

## **BRC333 Satplications: Interactive and Evolving Bitcoin Ordinals**
BRC333 satplications extend the possibilities of Bitcoin ordinals by enabling interactive, dynamic, and evolving digital artifacts. Powered by modular scripts and recursive inscriptions tied to specific satoshis, satplications are updatable, interactive, and inherently decentralized. By leveraging **Digital Matter Theory (DMT)**, these applications can build collections and artifacts rooted in Bitcoin’s immutable block data.

### What Makes Satplications Unique?
At their core, satplications are stacks of sats where the application code resides directly on specific satoshis. There are no smart contracts, gas fees, or scalability concerns typically associated with blockchain systems. Once deployed, a satplication remains accessible indefinitely, powered by Bitcoin's robust infrastructure.

Satplications are composed of three primary types of sats:
- **Controller Sats**: Govern the satplication, linking the logic and data components.
- **Logic Sats**: Contain modular code for the satplication, enabling functionality and updates.
- **Data Sats**: Store user data or state, evolving through reinscriptions.

The controller sat orchestrates the satplication, identifying which logic and data sats are active. When invoked:

- The logic sats provide the most recent version of the inscribed code modules.
- The data sats return all associated inscriptions, which can be updated through reinscriptions.

### Updating a Satplication
- **Logic Update**: Inscribe new code to the designated logic sat to enhance or modify functionality.
- **Behavior Update**: Reinscribe new data to the relevant data sats, dynamically changing the satplication's behavior or state.

### Core Features: Oracle and Time Travel Modules
Three innovative modules enhance the flexibility and interactivity of satplications:

1. **Oracle Module**
- Delivers context-sensitive actions, messages, and visual changes based on real-time blockchain events, such as block height or specific triggers.
- Enables dynamic storytelling, in-world messaging, and Bitcoin-driven announcements.

2. **Time Travel Module**
- Empowers ordinals to evolve across blockchain timelines, enabling historical or future states based on reinscriptions.
- Supports interactive experiences tied to specific moments in Bitcoin’s block history.

3. **DMT Module**
- Integrates Digital Matter Theory (DMT) to construct ordinals based on blockdata.
- Manages traits, rarities, and one-of-ones based on patterns in the block or nonce data.
- Assigns power values to ordinals based on traits.

### Applications and Potential
Satplications unlock new possibilities for interactive storytelling, gamification, and evolving digital collectibles. For example, the NatGoblin Satplication incorporates:
- Moon-cycle-based transformations aligned with real lunar phases.
- Power upgrades and dynamic traits.
- Interactive timelines that evolve through reinscriptions and user interactions.

With BRC333 satplications, the Bitcoin blockchain becomes a canvas for creative, dynamic, and truly decentralized digital experiences.

---

## **Key Features**  
- **Modular, Loadable Components**: Scripts are designed as modular components, easily loadable into different projects.
- **Pixel and SVG-based Visuals**: Offers flexibility for interactive, pixel-aligned art or vector-based graphics.
- **RPG-style Powers (0-10)**: Goblins and ordinals gain RPG powers that change based on traits or events.
- **Pako.js Compression**: Optimizes script size to minimize block space usage.
- **Oracle Messaging**: Context-aware messages appear at certain blocks or through offset-triggered events.
- **Time Travel Ready**: The satplication code can be updated using data inscriptions via the time travel module.
- **Review history**: Users can explore the expressions of ordinals at different times in the past and interact with evolving traits.

---

## **Repository Structure**  

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

## **Modules Overview**

1. **src_prod.json**
   - Identifies the **code and data sats** for the NatGoblin satplication.

2. **ng_prod.htm**  
   - The main HTML entry point for the NatGoblin satplication.  
   - Loads all required scripts, activates the time travel, and decompresses and appends the main logic script.  
   - Uses **Pako.js compression** to minimize file size.

3. **ng_prod.js**  
   - Manages the main logic for the **NatGoblin satplication**.  
   - Coordinates **DNA-based trait assignments**, moon-cycle transformations, and RPG-style power upgrades.  
   - Handles interactions such as **click-based background changes** and time-travel-enabled modal displays.

4. **BRC333oracle_m.js**  
   - Handles **oracle-based messaging** that responds to block events, offsets, and timelines.  
   - Oracle messages are dynamic and can include **text, images, and links**. For example, during a **full moon**, the oracle can display special messages or visuals, enhancing in-world storytelling.

5. **BRC333timetravel_m.js**  
   - Manages **time travel mechanics**, allowing users to explore how their ordinals change over time.  
   - Supports **reinscription-based updates** for ordinals and state changes at specific block heights.  
   - Users can navigate through different block states and interact with events like **unlocking rare traits** or **executing commands** at certain blocks.

6. **BRC333ui_m.js**  
   - Controls the **interactive interface**, including background changes, time selectors, and modals.  
   - Manages moon phase animations and displays dynamic information based on user actions.

7. **BRC333utils_m.js**  
   - Provides utility functions for **trait scoring, data aggregation**, and **moon phase synchronization**.

8. **BRC333dmt_m.js**  
   - The core logic module that integrates **DMT-based elements** into the satplication.  
   - Manages **power values, SVG rendering, and block-based calculations**.
---

## **Oracle Configuration**

The Oracle module triggers **messages, actions, and visual events** based on block data, offsets, or events. These messages can also contain **images or links** to enhance interactivity.

### **Oracle JSON Input Specification**

| Key        | Required | Description                                                  |
| ---------- | -------- | ------------------------------------------------------------ |
| `protocol` | YES      | Protocol to identify this as part of BRC333 (`"BRC333"`).    |
| `operation`| YES      | Operation type (`"oracle"`).                                 |
| `id`       | YES      | Unique identifier for the message.                           |
| `message`  | YES      | Text to display when triggered.                              |
| `block`    | NO       | Block number when the message will appear.                   |
| `offset`   | NO       | Block offset from minting block                              |
| `stop`     | NO       | Block or block offset when the message disappears.           |
| `image`    | NO       | Optional image URL to display with the message.              |
| `project`  | NO       | Specifies the project that the message belongs to.           |

### **Example Oracle Configuration**

```json
{
  "protocol": "BRC333",
  "operation": "oracle",
  "description": "Oracle demo for NatGoblin.",
  "messages": [
    {
      "id": "moon_event",
      "action": "add",
      "block": 888888,
      "message": "The full moon rises, and the goblins awaken!",
      "image": "/content/[inscriptionId]",
      "project": "natgoblin"
    }
  ]
}
```

---

## **Time Travel Configuration**

The Time Travel module allows users to **explore the evolution of their ordinals over time** by processing **block-based events and reinscriptions**.

### **Time Travel JSON Input Specification**

| Key        | Required | Description                                                        |
| ---------- | -------- | -------------------------------------------------------------------|
| `protocol` | YES      | Protocol to identify this as part of BRC333 (`"BRC333"`).          |
| `operation`| YES      | Operation type (`"timetravel"`).                                   |
| `id`       | YES      | Unique identifier for the timeline entry.                          |
| `block`    | NO       | Block height when the action occurs.                               |
| `offset`   | NO       | Offset block height for temporary actions.                         |
| `stop`     | NO       | Block height at which the event ends.                              |
| `type`     | YES      | Action type (`data`, `code`, `replace`, `replaceLines`, `command`) |
| `payload`  | YES      | Data or code to execute.                                           |
| `project`  | NO       | Specifies the project to which the entry belongs.                  |

### **Example Time Travel Configuration**

```json
{   
    "protocol": "BRC333",
    "operation": "timetravel",
    "description": "This is a timetravel demo for NatGoblins.",
    "entries":  [
        { "project": "natgoblins", "type": "replaceLines", "payload": "{ \"scriptName\": \"goblins\", \"start\": 1, \"stop\": -1, \"code\": \"   console.log('TimeTravel is active');\"}"},
        { "project": "natgoblins", "type": "replace", "payload": "{ \"funcName\": \"playCameraSound\", \"funcBody\": \"console.log('Time Travel logging camerasound');cameraSound.currentTime = 0; cameraSound.play();\"}", "height": 888888},
        { "project": "natgoblins", "type": "data", "payload": { "natGoblin": { "greeting": "Gob Gob Gob!"} } },
        { "project": "natgoblins", "type": "code", "payload": "function greet(handle) { console.log(`${window[handle].greeting}\nTime Travel has executed successfully!`); }"},
        { "project": "natgoblins", "type": "command", "payload": "console.log('Initiate Time Travel');greet('natGoblin');"}
    ]
}
```

---

## **How to Run the Application Locally**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Bridgit-SPC/brc333
   ```

2. Open **ng_prod_local.htm** in your browser to access the local NatGoblin interface.

## To create your own satplication based on the NatGoblin satplication, follow these steps:

1. Make your desired changes in ```ng_local.js```
2. Compress the modified file
```node compress ng_prod.js```
3. Copy the compressed output in ```/decompress/decompress_ng_local.js``` into the main satplication script ```/decompress/ng_prod_local.js``` and then open **ng_prod_local.htm** in the browser.
4. You may want to create new data inscriptions for timetravel and oracle, in which case you need to modify ```/json/src_prod.json``` and add the new sat number in the ```"sat"``` field of ```/decompress/ng_prod_local.js```.
5. To inscribe, you will need to modify ```/decompress/ng_prod_local.js``` to set testing = false and remove the references to ```https://ordinals.com/```

---


## **How to Contribute**

Submit **issues or pull requests** through GitHub.

---

## **Resources**

- [BRC333 Protocol](https://brc333.xyz)  
- [Pachaverse](https://pachaverse.io)  

---

## **License**

Licensed under the **MIT License**.

---

## **Credits**

Special thanks to **Shiftshapr** and the BRC333 community for building the NatGoblin satplication.