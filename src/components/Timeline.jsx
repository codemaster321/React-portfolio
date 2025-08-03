import { Suspense } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

export default function Timeline() {
  return (
    <Suspense fallback="Loading....">
      <section className="timeline section">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="cpu--icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="heading">Experience</h1>
        </div>
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
            contentArrowStyle={{
              borderRight: "7px solid rgba(189, 232, 202, 0.3)",
            }}
            date="2018-2022"
            dateClassName="timeline-date"
            iconStyle={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
            }}
          >
            <h3 className="vertical-timeline-element-title">Student</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Dehradun, India
            </h4>
            <p>DIT University</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
            contentArrowStyle={{
              borderRight: "7px solid rgba(189, 232, 202, 0.3)",
            }}
            date="2022-2024"
            dateClassName="timeline-date"
            iconStyle={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
            }}
          >
            <h3 className="vertical-timeline-element-title">
              Associate IT Consultant
            </h3>
            <h4 className="vertical-timeline-element-subtitle">ITC Infotech</h4>
            <p>IT development and consulting</p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </section>
    </Suspense>
  );
}
