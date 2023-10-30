import { v4 as uuidv4 } from 'uuid';

interface Employee {
	id?: string;
	name: string;
	department: string;
	salary: number;
	office: string;
	isManager: boolean;
	skills: string[];
}

interface Options {
	id?: boolean;
}

const getEmployees = async (kvStore: KVNamespace, options?: Options) => {
	const { keys } = await kvStore.list<string>();

	const employees = await Promise.all(
		keys.map(async ({ name: id }) => {
			const employee = await kvStore.get<Employee>(id, { type: 'json' });

			if (employee && options?.id) {
				employee.id = id;
			}

			return employee;
		})
	);

	return employees.filter((employee): employee is Employee => employee !== null);
};

const postEmployees = async (employees: Employee[], kvStore: KVNamespace): Promise<void> => {
	try {
		const employeePromises = employees.map((employee) => {
			const employeeId = uuidv4();
			return kvStore.put(employeeId, JSON.stringify(employee));
		});
		await Promise.all(employeePromises);
	} catch (error) {
		console.error('Error posting employees:', error);
		throw error;
	}
};

export { type Employee, getEmployees, postEmployees };
