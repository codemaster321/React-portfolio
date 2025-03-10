import React from "react";
import {
  FaJs,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaPython,
  FaReact,
} from "react-icons/fa";

const skillData = [
  { name: "Vanilla JS", icon: <FaJs /> },
  { name: "Node", icon: <FaNodeJs /> },
  { name: "HTML", icon: <FaHtml5 /> },
  { name: "CSS", icon: <FaCss3Alt /> },
  { name: "Python", icon: <FaPython /> },
  { name: "React", icon: <FaReact /> },
];

const Skill = () => {
  return (
    <div className="skills-list">
      {skillData.map((skill, index) => (
        <div key={index} className="skill">
          <div className="icon">{skill.icon}</div>
          <span>{skill.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Skill;
