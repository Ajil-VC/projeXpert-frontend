

interface projectMember {
    email : string, 
    role: 'admin' | 'user'
}

export interface projectView {
    name: string,
    status: string,
    priority: string,
    members: projectMember[]
};