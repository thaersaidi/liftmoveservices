import React from 'react';
import { CheckCircle, ArrowRightCircle } from "lucide-react";
import { MessageCircle, VenetianMask, PocketKnife, Book, Info } from "lucide-react";

function Button({ href, ariaLabel, children }) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200"
    >
      {children}
    </a>
  );
}

export default function WelcomeSection() {
  return (
<>
<h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-foreground">Welcome</h1>
<section className="mb-8">
      <div className="p-4 md:p-6 bg-background rounded-lg shadow-md flex flex-col md:flex-row items-center">
        <Info size={36} className="text-foreground mb-4 md:mb-0 md:mr-4"/>
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">Get Started</h2>
          <p className="text-foreground mb-4">
            To get started with Connectorzzz, explore our features using the buttons below:
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/chat" ariaLabel="Go to the Chat page">
              <MessageCircle className="mr-2" size={20} />
              Chat
            </Button>
            <Button href="/persona" ariaLabel="Go to the Persona configuration page">
              <VenetianMask className="mr-2" size={20} />
              Persona
            </Button>
            <Button href="/agents" ariaLabel="Go to the Agents (Extensions) configuration page">
              <PocketKnife className="mr-2" size={20} />
              Agents
            </Button>
            <Button href="/prompt" ariaLabel="Go to the Prompt Library configuration page">
              <Book className="mr-2" size={20} />
              Prompts
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-8">
      <div className="p-4 md:p-6 bg-background rounded-lg shadow-md flex flex-col md:flex-row items-center">
        <Info size={36} className="text-background mb-4 md:mb-0 md:mr-4"/>
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">About Connectorzzz</h2>
          <p className="text-foreground">
            Connectorzzz is an innovative solution that harnesses the power of multiple AI agents working together to solve complex problems and streamline workflows.
          </p>
        </div>
      </div>
    </section>

    <section className="mb-8">
      <div className="p-4 md:p-6 bg-background rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground flex items-center">
          <CheckCircle size={24} className="mr-2"/> Key Features
        </h2>
        <ul className="list-disc list-inside text-foreground">
          <li className="mb-2 flex items-start">
            <ArrowRightCircle size={20} className="text-foreground mr-2 flex-shrink-0"/> Multi-agent collaboration for complex problem-solving
          </li>
          <li className="mb-2 flex items-start">
            <ArrowRightCircle size={20} className="text-foreground mr-2 flex-shrink-0"/> Adaptive learning algorithms for continuous improvement
          </li>
          <li className="mb-2 flex items-start">
            <ArrowRightCircle size={20} className="text-foreground mr-2 flex-shrink-0"/> Seamless integration with existing workflows and systems
          </li>
          <li className="mb-2 flex items-start">
            <ArrowRightCircle size={20} className="text-foreground mr-2 flex-shrink-0"/> Customizable agent behaviors and specializations
          </li>
        </ul>
      </div>
    </section>

    <section className="mb-8">
      <div className="p-4 md:p-6 bg-background rounded-lg shadow-md flex flex-col md:flex-row items-center">
        <Info size={36} className="text-foreground mb-4 md:mb-0 md:mr-4"/>
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">How It Works</h2>
          <p className="text-foreground">
            Connectorzzz utilizes a distributed network of AI agents, each specialized in different tasks. 
            The system continuously learns and adapts, improving its performance over time.
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
