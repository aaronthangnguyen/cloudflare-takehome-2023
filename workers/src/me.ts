const aboutMe = () => {
	const responseData = {
		name: 'Aaron Nguyen',
		homepage: 'https://aaronnguyen.dev/',
		githubURL: 'https://github.com/aaronthangnguyen/',
		interestingFact:
			"I have a bachelor in Law and am currently completing my second degree in Computer Science. I've also had the honor of serving in the U.S. Army Reserve as a combat medic.",
		skills: [
			'Go',
			'Python',
			'Java',
			'C#',
			'C',
			'JavaScript',
			'TypeScript',
			'HTML',
			'CSS',
			'SQL',
			'ASP.NET',
			'Spring Boot',
			'React.js',
			'Node.js',
			'FastAPI',
			'Jest',
			'Git',
			'Docker',
			'GitHub',
			'Maven',
			'Azure',
			'Nginx',
			'Neovim',
			'Visual Studio Code',
			'JetBrains',
		],
	};

	return new Response(JSON.stringify(responseData), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export { aboutMe };
