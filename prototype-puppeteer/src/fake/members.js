const memberNames = [
    "Amina Hassan",
    "Liam O'Connor",
    "Sofia Alvarez",
    "Noah Williams",
    "Mei Chen",
    "Mateo Silva",
    "Priya Sharma",
    "Elias Müller",
    "Fatima Zahra",
    "Daniel Kim",
    "Olivia Bennett",
    "Yuki Tanaka",
    "Kwame Mensah",
    "Leila Haddad",
    "Lucas Moreau",
    "Nia Johnson",
    "Arjun Patel",
    "Elena Petrova",
    "Samuel Okafor",
    "Ines Costa",
];
const fakeMembers = memberNames.map((name, index) => {
    const sequence = String(index + 1).padStart(12, "0");
    const timestamp = new Date(Date.UTC(2025, 0, index + 1, 9)).toISOString();
    return {
        id: `00000000-0000-4000-8000-${sequence}`,
        ifsId: `ifs:member:${String(index + 1).padStart(3, "0")}`,
        entityType: "Member",
        entityDocumentationUrl: "https://individualfreedom.systems/entities/member",
        name,
        permissions: [],
        isOwner: index === 0,
        createdAt: timestamp,
        updatedAt: timestamp,
    };
});
export {};
//# sourceMappingURL=members.js.map