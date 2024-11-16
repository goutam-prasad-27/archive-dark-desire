// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Define the archive object containing the main element and project elements
const archive = {
	element: document.querySelector(".archive"),
	projects: document.querySelectorAll(".archive-project:not(:last-child)"),
};

// Initialize the Lenis smooth scrolling
let lenis;
const initLenis = () => {
	lenis = new Lenis({
		lerp: 0.05, // Linear interpolation factor for smooth scrolling
	});
	lenis.on("scroll", ScrollTrigger.update); // Update ScrollTrigger on scroll

	// Add Lenis' requestAnimationFrame to GSAP's ticker
	gsap.ticker.add((time) => lenis.raf(time * 1000));
	gsap.ticker.lagSmoothing(0); // Disable lag smoothing
};

// Initialize the animation for the archive projects
const initAnimation = () => {
	// Set zIndex for each project to ensure correct stacking order
	for (let i = 0; i < archive.projects.length; i++) {
		archive.projects[i].style.zIndex = archive.projects.length - i;
	}

	// Create a GSAP timeline with ScrollTrigger
	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: archive.element, // Element that triggers the scroll
			start: "top top", // Start when the top of the trigger hits the top of the viewport
			end: "+=6500", // End after scrolling 6500px
			scrub: 2, // Smooth scrubbing, takes 2 seconds to catch up
			pin: true, // Pin the trigger element during the animation
			snap: 1 / archive.projects.length, // Snap to each project
		},
	});

	// Animate each project
	archive.projects.forEach((project, idx) => {
		if (idx === archive.projects.length) return; // Skip the last project

		// Select media and thumbnail elements within the project
		const projectMedia = project.querySelectorAll(
				".archive-project-media"
			),
			projectThumbnail = project.querySelectorAll(
				".archive-project-thumbnail"
			);

		// Set initial clipPath for media and thumbnail
		gsap.set([projectMedia, projectThumbnail], {
			clipPath: "inset(0% 0% 0% 0%)",
		});

		// Add animations to the timeline
		timeline
			.to(
				[projectMedia, projectThumbnail],
				{
					clipPath: "inset(0% 100% 0% 0%)", // Animate clipPath to create a reveal effect
					filter: "grayscale(200%) blur(3px)", // Apply grayscale and blur filters
				},
				idx // Start each animation at the index position
			)
			.to(project, { pointerEvents: "none" }); // Disable pointer events after animation
	});
};

// Initialize Lenis and animations on DOM content loaded
window.addEventListener("DOMContentLoaded", () => {
	initLenis();
	initAnimation();

	// Add click event to scroll to top when the paragraph in .media-text is clicked
	document
		.querySelector(".media-text p")
		.addEventListener("click", () => lenis.scrollTo(0));
});
