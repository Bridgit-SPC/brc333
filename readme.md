# **BRC333 Satplications: Dynamic Ordinals on Bitcoin**

### **Overview**  
BRC333 satplications extend the potential of Bitcoin ordinals by enabling **interactive and evolving digital artifacts**. Satplications operate through **modular scripts and recursive inscriptions** tied to designated satoshis, making them easily updatable and interactive. These applications may use **Digital Matter Theory (DMT)** to construct ordinal collections that are based on Bitcoin blockdata. 

The key thing about a satplication is that the code lives on specific sats. Satplictaions are quite literally stacks of sats. There are no smart contracts, no gas fees, and no need to worry about the Bitcoin blockchain's scaling issues. Once a satplication is deployed it will be freely accessible for the the foreseeable future. Satplications have three types of sats: controller, logic, and data. The controller sat is the sat that controls the satplication. The logic sats are the sats that contains the code modules for the satplication. The data sats are the sats that recieve data for the satplication. The controller sat identifies that specific logic and data sats that belong to the satplication. When a logic sat is called, the satplictaion looks for the last version of the module that has been inscribed to the sat. When a data sat is polled, the satplication gets all the inscriptions that have been inscribed to the sat. To update the satplication code, a new logic scriptis insribed to the deisgnated sat. To change the behavior, one or more of the data sats is reinscribed with new data to be processed. 

Two key features powering these applications are the **Oracle module** and **Time Travel module**. Together, they allow ordinals to **respond dynamically to block data, time-based events, user interactions, and reinscriptions**.

- **Oracle Module**: Delivers context-sensitive messages, actions, and visual changes based on **block height triggers, offsets, or events**. The oracle provides in-world messaging or announcements that reflect events in the Bitcoin blockchain or satplication world.  
- **Time Travel Module**: Allows ordinals to **change their state across different blocks and timelines** by processing reinscriptions dynamically. Users can explore the historical or future states of their ordinals and interact with traits, visual components, or functionality tied to specific moments in the blockchain timeline.

These features make BRC333 satplications highly versatile, supporting **interactive storytelling, gamified experiences, and evolving digital collectibles**. In the **NatGoblin satplication**, these modules enable moon-cycle-based transformations, power upgrades, and interactive timelines.

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