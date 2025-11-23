# Shinobi Clash - 2D Ninja Fighting Game

A fast-paced, anime-style 2D fighting game inspired by Naruto featuring combo-based combat, special jutsu abilities, and intelligent AI opponents.

## Features

### Core Gameplay
- **Combo-Based Combat System**: Chain attacks together for massive combo multipliers
- **Health & Chakra Systems**: Manage your health and chakra resources strategically
- **Special Jutsu Abilities**: Unleash powerful special moves and ultimate jutsu attacks
- **Intelligent AI Opponent**: Fight against adaptive AI that learns from your patterns

### Game Modes & Difficulty
- **4 Difficulty Levels**:
  - **Genin (Easy)**: Perfect for learning the game mechanics
  - **Chunin (Medium)**: Balanced challenge for most players
  - **Jonin (Hard)**: Aggressive AI with quick reactions
  - **Hokage (Extreme)**: Ultimate challenge with near-perfect AI

### Arenas
Choose from 4 unique dynamic arenas:
- **Hidden Leaf Forest**: Fight among the trees
- **Mountain Valley**: Battle in the rocky mountains
- **Training Grounds**: Classic village training area
- **Waterfall Arena**: Combat near the rushing waterfall

### Visual Effects
- Particle effects for impacts and hits
- Special jutsu visual effects with glowing animations
- Combo text displays
- Smooth sprite-based character animations
- Dynamic health and chakra bars

## Controls

### Keyboard Controls
| Action | Primary Key | Alternative Key |
|--------|-------------|-----------------|
| Move Left | A | Left Arrow |
| Move Right | D | Right Arrow |
| Jump | W | Up Arrow |
| Attack | J | Space |
| Special Jutsu | K | Shift |
| Ultimate Jutsu | L | Enter |
| Block | S | Down Arrow |
| Pause | Escape | - |

## Quick Start

### Setup
1. **Optional - Add Character Images**:
   - Add character portrait images to the `images/` folder
   - See [images/README.md](images/README.md) for details
   - The game works perfectly without images (uses CSS avatars as fallback)

2. **Launch the Game**:
   - Open `index.html` in any modern web browser
   - No server or installation required!

### Getting Started
1. **Select Your Character** - Choose from 6 unique fighters
2. **Choose Difficulty** - Pick from Genin (Easy) to Hokage (Extreme)
3. **Select Arena** - Pick your battlefield
4. **Click "START GAME"** - Begin fighting!

### Combat Mechanics

#### Basic Attacks (J / Space)
- Quick melee attacks that build combos
- No chakra cost
- Best for close-range combat

#### Special Jutsu (K / Shift)
- **Chakra Cost**: 25
- Powerful mid-range attack
- Deals 15 damage with significant knockback
- Creates visual effects

#### Ultimate Jutsu (L / Enter)
- **Chakra Cost**: 50
- Devastating area attack
- Deals 30 damage with massive knockback
- Game-changing move with impressive visuals

#### Blocking (S / Down)
- Reduces incoming damage by 70%
- Reduces knockback by 50%
- Use strategically to defend against attacks

### Strategy Tips

1. **Manage Your Chakra**: Chakra regenerates slowly, so use special moves wisely
2. **Build Combos**: Chain attacks without getting hit to increase your combo counter
3. **Block Timing**: Perfect blocks can turn the tide of battle
4. **Movement**: Use jumps and lateral movement to avoid attacks
5. **Watch Health**: When health is low (below 30%), the AI becomes more aggressive
6. **Adaptive AI**: The AI learns your patterns - vary your strategy!

### Winning Conditions
- Reduce opponent's health to 0
- Have more health when time runs out (99 seconds)

## Technical Features

### AI Behavior System
The AI opponent features sophisticated behavior including:
- **Adaptive Difficulty**: Reaction times and aggression scale with difficulty
- **Pattern Recognition**: Learns from player attack patterns
- **State Machine**: Multiple AI states (attacking, blocking, defensive, positioning)
- **Health-Based Tactics**: Changes strategy when health is low
- **Smart Positioning**: Maintains optimal combat distance

### Combat System
- Combo multipliers and tracking
- Hit detection with knockback physics
- Stun mechanics
- Cooldown management for abilities
- Damage calculation with blocking modifiers

### Animation System
- Character state-based animations (idle, run, jump, attack, block, stunned)
- Smooth frame transitions
- Directional sprite flipping
- Visual feedback for all actions

### Effects System
- Particle system for impacts
- Jutsu effect animations
- Combo text displays
- Screen shake on heavy hits
- Dynamic visual feedback

## Game Architecture

### Main Components
- **Game Engine**: Manages game loop, state, and rendering
- **Character Class**: Handles player/enemy properties and actions
- **AI Controller**: Controls enemy behavior with adaptive AI
- **Arena System**: Manages different fighting stages
- **Effect System**: Handles all visual effects and particles
- **Input Handler**: Processes keyboard input

### Performance
- Optimized rendering pipeline
- Efficient particle management
- Smooth 60 FPS gameplay
- Responsive controls with minimal input lag

## Browser Compatibility
- Chrome (Recommended)
- Firefox
- Edge
- Safari
- Any modern browser with HTML5 Canvas support

## Credits
Inspired by the Naruto anime series, this game recreates the fast-paced ninja combat experience with unique mechanics and strategic depth.

---

**Enjoy the battle, and may the strongest shinobi win!**
