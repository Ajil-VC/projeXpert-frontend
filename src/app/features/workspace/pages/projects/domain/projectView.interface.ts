

interface projectMember {
    _id: string,
    email: string,
    role: 'admin' | 'user'
}

export interface projectView {
    _id?: string,
    name: string,
    status: string,
    priority: string,
    members: projectMember[]
};