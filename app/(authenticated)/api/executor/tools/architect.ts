import { cost_optimization_questions, operational_excellence_questions, performance_questions, reliability_questions, security_questions } from './data';

const contentMap: { [key: string]: string } = {
    security: security_questions,
    reliability: reliability_questions,
    performance: performance_questions,
    operational_excellence_questions: operational_excellence_questions,
    cost_optimization_questions: cost_optimization_questions
}

export const architect_waf_questionnaire = async (pillar: string): Promise<string> => {
    try {
        const data = contentMap;
        return data[pillar];
    } catch (error) {
        console.error(`Error reading the file for pillar ${pillar}:`, error);
        throw new Error(`Could not read the file for pillar ${pillar}`);
    }
};


