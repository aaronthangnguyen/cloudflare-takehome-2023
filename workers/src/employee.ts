import { Employee } from './kv/employees';

interface RequestBody {
	name: string;
	department: string;
	minSalary: number;
	maxSalary: number;
	office: string;
	skill: string;
}

interface ConditionMap {
	[key: string]: boolean;
}

interface ResponseData {
	employees: Employee[];
}

const getEmployees = async (kvStore: KVNamespace) => {
	const value = await kvStore.list<string>();
	const employeePromises: Promise<Employee | null>[] = value.keys.map(async ({ name: id }) => {
		const value = await kvStore.get<Employee>(id, { type: 'json' });
		return value;
	});

	const filteredEmployeePromises: Promise<Employee>[] = employeePromises
		.filter((promise): promise is Promise<Employee> => promise !== null)
		.map((promise) => promise as Promise<Employee>);

	return await Promise.all(filteredEmployeePromises);
};

const generateConditions = (criteria: RequestBody, employee: Employee): boolean[] => {
	const conditions: boolean[] = [];
	const conditionMap: ConditionMap = {
		name: new RegExp(criteria.name).test(employee.name),
		department: new RegExp(criteria.department).test(employee.department),
		minSalary: criteria.minSalary <= employee.salary,
		maxSalary: criteria.maxSalary >= employee.salary,
		office: new RegExp(criteria.office).test(employee.office),
		skill: criteria.skill in employee.skills,
	};

	for (const key in conditionMap) {
		if (key in criteria) {
			conditions.push(conditionMap[key]);
		}
	}

	return conditions;
};

const handlePostEmployee = async (request: Request, kvStore: KVNamespace) => {
	const criteria = (await request.json()) as RequestBody;
	const employees: Employee[] = await getEmployees(kvStore);

	const filteredEmployee = employees.filter((employee) => {
		const conditions = generateConditions(criteria, employee);
		return conditions.every((condition) => condition);
	});

	const responseData: ResponseData = { employees: filteredEmployee };
	return new Response(JSON.stringify(responseData), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export { handlePostEmployee };
