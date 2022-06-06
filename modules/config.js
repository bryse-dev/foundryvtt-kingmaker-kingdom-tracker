
// PC Attributes
const STRENGTH = 'strength';
const DEXTERITY = 'dexterity';
const CONSTITUTION = 'constitution';
const INTELLIGENCE = 'intelligence';
const WISDOM = 'wisdom';
const CHARISMA = 'charisma';

// PC Skills
//TODO: ability to convert to dnd5e
const KNOWLEDGE_ARCANA = 'knowledge(arcana)';
const KNOWLEDGE_LOCAL = 'knowledge(local)';
const KNOWLEDGE_NOBILITY = 'knowledge(nobility)';
const KNOWLEDGE_RELIGION = 'knowledge(religion)';
const KNOWLEDGE_GEOGRAPHY = 'knowledge(geography)';
const KNOWLEDGE_ENGINEERING = 'knowledge(engineering)';
const PROFESSION_SOLDIER = 'profession(soldier)';
const PROFESSION_MERCHANT = 'profession(merchant)';
const DIPLOMACY = 'diplomacy';
const SURVIVAL = 'survival';
const INTIMIDATE = 'intimidate';
const SENSE_MOTIVE = 'sense motive'

// Kingdom Attributes
const ECONOMY = 'economy';
const LOYALTY = 'loyalty';
const STABILITY = 'stability';
const FAME = 'fame';
const INFAMY = 'infamy';
const CORRUPTION = 'corruption';
const CRIME = 'crime';
const LAW = 'law';
const LORE = 'lore';
const PRODUCTIVITY = 'productivity';
const SOCIETY = 'society';

// Kingdom Modifiers
const LEADERSHIP = 'leadership';

export class KingdomConfig {

    static governmentTypes() {
        return ["Magocracy", "Autocracy", "Oligarchy", "Overlord", "Republic", "Secret Syndicate", "Theocracy"];
    }

    constructor() {
        this.controlDC = 15;
        this.leadershipRoles = [
            new LeadershipRole('Ruler', [CHARISMA], [ECONOMY, LOYALTY, STABILITY], 1, [], 0, LEADERSHIP, 0,
                "Choose one kingdom attribute (Economy, Loyalty, or Stability). Add your Charisma modifier to this attribute.  If your kingdom's Size is 26–100, choose a second kingdom attribute and add your Charisma modifier to it as well.  If your kingdom's Size is 101 or more, choose a third kingdom attribute and add your Charisma modifier to it too.  If you have the Leadership feat, the bonus from the feat applies to all kingdom attributes you affect (one, two, or three attributes, depending on the kingdom's Size).",
                "A kingdom without a ruler cannot claim new hexes, create Farms, build Roads, or purchase settlement districts. Unrest increases by 4 during the kingdom's Upkeep Phase."
            ),
            new LeadershipRole('Consort', [CHARISMA], [LOYALTY], 0.5, [KNOWLEDGE_NOBILITY], 5, LEADERSHIP, 1,
                "Add half your Charisma modifier to Loyalty.  If the ruler is unavailable during a turn, you may act as the Ruler for that turn, negating the vacancy penalty for having no Ruler, though you do not gain the Ruler benefit.  If you act as the Ruler for the turn, you must succeed at a Loyalty check during the kingdom's Upkeep Phase or Unrest increases by 1.",
                "None"
            ),
            new LeadershipRole('Councilor', [CHARISMA, WISDOM], [LOYALTY], 1, [KNOWLEDGE_LOCAL], 5, LEADERSHIP, 1,
                "Add your Charisma modifier or Wisdom modifier to Loyalty.",
                "Loyalty decreases by 2. The kingdom gains no benefits from the Holiday edict. During the Upkeep Phase, Unrest increases by 1.",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            ),
            new LeadershipRole('General', [CHARISMA, STRENGTH], [STABILITY], 1, [PROFESSION_SOLDIER], 5, LEADERSHIP, 1,
                "Add your Charisma modifier or Strength modifier to Stability.",
                "Loyalty decreases by 4.",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            ),
            new LeadershipRole('Grand Diplomat', [CHARISMA, INTELLIGENCE], [STABILITY], 1, [DIPLOMACY], 5, LEADERSHIP, 1,
                "Add your Charisma modifier or Intelligence modifier to Stability.",
                "Stability decreases by 2. The kingdom cannot issue Diplomatic or Exploration edicts.",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            ),
            new LeadershipRole('Heir', [CHARISMA], [LOYALTY], 0.5, [KNOWLEDGE_NOBILITY], 5, LEADERSHIP, 1,
                "Add half your Charisma modifier to Loyalty. You may act as the Ruler for a turn, negating the vacancy penalty for the kingdom having no Ruler, though you do not gain the Ruler benefit.  Whenever you act as the Ruler for the turn, you must succeed at a Loyalty check during the kingdom's Upkeep Phase or Unrest increases by 1.",
                "None",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            ),
            new LeadershipRole('High Priest', [CHARISMA, WISDOM], [STABILITY], 1, [KNOWLEDGE_RELIGION], 5, LEADERSHIP, 1,
                "Add your Charisma modifier or Wisdom modifier to Stability.",
                "Stability and Loyalty decrease by 2. During the Upkeep Phase, Unrest increases by 1.",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            ),
            new LeadershipRole('Magister', [CHARISMA, INTELLIGENCE], [ECONOMY], 1, [KNOWLEDGE_ARCANA], 5, LEADERSHIP, 1,
                "Add your Charisma modifier or Intelligence modifier to Economy.",
                "Economy decreases by 4.",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            ),
            new LeadershipRole('Marshal', [DEXTERITY, WISDOM], [ECONOMY], 1, [SURVIVAL], 5, LEADERSHIP, 1,
                "Add your Dexterity modifier or Wisdom modifier to Economy.",
                "Economy decreases by 4.",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            ),
            new LeadershipRole('Royal Enforcer', [DEXTERITY, STRENGTH], [LOYALTY], 1, [INTIMIDATE], 5, LEADERSHIP, 1,
                "Add your Dexterity modifier or Strength modifier to Loyalty. During the Upkeep Phase, you may decrease Unrest by 1 (this is not affected by having the Leadership feat); if you do so, you must succeed at a Loyalty check or Loyalty decreases by 1.",
                "None",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            ),
            new LeadershipRole('Spymaster', [DEXTERITY, INTELLIGENCE], [ECONOMY, LOYALTY, STABILITY], 1, [SENSE_MOTIVE], 5, LEADERSHIP, 1,
                "During the Edict Phase, choose one kingdom attribute (Economy, Loyalty or Stability). Add your Dexterity modifier or Intelligence modifier to this attribute.",
                "Economy decreases by 4. During the Upkeep Phase, Unrest increases by 1.",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1.",
            ),
            new LeadershipRole('Treasurer', [INTELLIGENCE,WISDOM], [ECONOMY], 1, [PROFESSION_MERCHANT], 5, LEADERSHIP, 1,
                "Add your Intelligence modifier or Wisdom modifier to Economy.",
                "Economy decreases by 4. The kingdom cannot collect taxes—during the Edict Phase, when you would normally collect taxes, the kingdom does not collect taxes at all and the taxation level is considered \"none.\"",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1.",
            ),
            new LeadershipRole('Viceroy', [INTELLIGENCE,WISDOM], [ECONOMY], 0.5, [KNOWLEDGE_GEOGRAPHY], 5, LEADERSHIP, 1,
                "Add half your Intelligence or Wisdom modifier to Economy.  You may assume any leadership role (including Ruler) for your colony or vassal state, but any benefit you provide in this role is 1 less than normal; if you do so, you must spend 7 days that month performing duties appropriate to that leadership role in addition to the 7 days spent for Viceroy duties.",
                "If you have no Viceroy for your vassal state, treat it as if it had the Ruler vacancy penalty.",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            ),
            new LeadershipRole('Warden',[CONSTITUTION, STRENGTH], [LOYALTY], 1, [KNOWLEDGE_ENGINEERING], 5, LEADERSHIP, 1,
                "Add your Constitution modifier or Strength modifier to Loyalty.",
                "Loyalty and Stability decrease by 2.",
                "For every 5 full ranks in a relevant skill, the leader may increase the leadership modifier by an additional 1."
            )
        ]
    }
}

class LeadershipRole {
    constructor(name, pcAttributes, kingdomAttributes, bonusRatio, pcLeadershipSkills, leadershipRanksModulus, leadershipKingdomAttribute, leadershipKingdomAttributeModifier, description, penaltyDescription, leadershipSkillDescription ) {
        this.name = name;

        // Kingdom Attribute Bonus.  kingdomAttribute += pcAttribute * bonusRation
        this.pcAttribute = pcAttributes;
        this.kingdomAttribute = kingdomAttributes;
        this.bonusRatio = bonusRatio;

        //TODO: Vacancy penalties

        // Leadership skills and their effects.  leadershipKingdomAttribute += (pcLeadershipSkills % leadershipRanksModulus) * leadershipKingdomAttributeModifier
        this.pcLeadershipSkills = pcLeadershipSkills;
        this.leadershipRanksModulus = leadershipRanksModulus;
        this.leadershipKingdomAttribute = leadershipKingdomAttribute;
        this.leadershipKingdomAttributeModifier = leadershipKingdomAttributeModifier;

        this.description = description || "None";
        this.penaltyDescription = penaltyDescription || "None";
        this.leadershipSkillDescription = leadershipSkillDescription || "None";
    }
}