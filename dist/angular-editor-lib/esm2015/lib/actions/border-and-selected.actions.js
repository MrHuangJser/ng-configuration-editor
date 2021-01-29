export function clearSelected() {
    return (state) => (Object.assign(Object.assign({}, state), { selected: new Set([]) }));
}
export function addSelectedNodes(ids) {
    return (state) => (Object.assign(Object.assign({}, state), { selected: new Set([...state.selected, ...ids]) }));
}
export function removeSelectedNodes(ids) {
    return (state) => (Object.assign(Object.assign({}, state), { selected: new Set([...state.selected].filter((id) => !ids.includes(id))) }));
}
export function setSelectedNodes(ids) {
    return (state) => (Object.assign(Object.assign({}, state), { selected: new Set([...ids]) }));
}
export function clearBordered() {
    return (state) => (Object.assign(Object.assign({}, state), { bordered: new Set([]) }));
}
export function addBorderedNodes(ids) {
    return (state) => (Object.assign(Object.assign({}, state), { bordered: new Set([...state.bordered, ...ids]) }));
}
export function removeBorderedNodes(ids) {
    return (state) => (Object.assign(Object.assign({}, state), { bordered: new Set([...state.bordered].filter((id) => !ids.includes(id))) }));
}
export function setBorderedNodes(ids) {
    return (state) => (Object.assign(Object.assign({}, state), { bordered: new Set([...ids]) }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9yZGVyLWFuZC1zZWxlY3RlZC5hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItZWRpdG9yLWxpYi9zcmMvIiwic291cmNlcyI6WyJsaWIvYWN0aW9ucy9ib3JkZXItYW5kLXNlbGVjdGVkLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxVQUFVLGFBQWE7SUFDM0IsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsaUNBQU0sS0FBSyxLQUFFLFFBQVEsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxDQUFDO0FBQzFELENBQUM7QUFFRCxNQUFNLFVBQVUsZ0JBQWdCLENBQVUsR0FBYTtJQUNyRCxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxLQUFLLEtBQUUsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBRyxDQUFDO0FBQ25GLENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQVUsR0FBYTtJQUN4RCxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxLQUFLLEtBQUUsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFHLENBQUM7QUFDN0csQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBVSxHQUFhO0lBQ3JELE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLGlDQUFNLEtBQUssS0FBRSxRQUFRLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUcsQ0FBQztBQUNoRSxDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWE7SUFDM0IsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsaUNBQU0sS0FBSyxLQUFFLFFBQVEsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxDQUFDO0FBQzFELENBQUM7QUFFRCxNQUFNLFVBQVUsZ0JBQWdCLENBQVUsR0FBYTtJQUNyRCxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxLQUFLLEtBQUUsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBRyxDQUFDO0FBQ25GLENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQVUsR0FBYTtJQUN4RCxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxLQUFLLEtBQUUsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFHLENBQUM7QUFDN0csQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBVSxHQUFhO0lBQ3JELE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLGlDQUFNLEtBQUssS0FBRSxRQUFRLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUcsQ0FBQztBQUNoRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUFjdGlvblR5cGUgfSBmcm9tICcuLi9zdG9yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclNlbGVjdGVkPFQgPSBhbnk+KCk6IElBY3Rpb25UeXBlPFQ+IHtcbiAgcmV0dXJuIChzdGF0ZSkgPT4gKHsgLi4uc3RhdGUsIHNlbGVjdGVkOiBuZXcgU2V0KFtdKSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFNlbGVjdGVkTm9kZXM8VCA9IGFueT4oaWRzOiBzdHJpbmdbXSk6IElBY3Rpb25UeXBlPFQ+IHtcbiAgcmV0dXJuIChzdGF0ZSkgPT4gKHsgLi4uc3RhdGUsIHNlbGVjdGVkOiBuZXcgU2V0KFsuLi5zdGF0ZS5zZWxlY3RlZCwgLi4uaWRzXSkgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTZWxlY3RlZE5vZGVzPFQgPSBhbnk+KGlkczogc3RyaW5nW10pOiBJQWN0aW9uVHlwZTxUPiB7XG4gIHJldHVybiAoc3RhdGUpID0+ICh7IC4uLnN0YXRlLCBzZWxlY3RlZDogbmV3IFNldChbLi4uc3RhdGUuc2VsZWN0ZWRdLmZpbHRlcigoaWQpID0+ICFpZHMuaW5jbHVkZXMoaWQpKSkgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTZWxlY3RlZE5vZGVzPFQgPSBhbnk+KGlkczogc3RyaW5nW10pOiBJQWN0aW9uVHlwZTxUPiB7XG4gIHJldHVybiAoc3RhdGUpID0+ICh7IC4uLnN0YXRlLCBzZWxlY3RlZDogbmV3IFNldChbLi4uaWRzXSkgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckJvcmRlcmVkPFQgPSBhbnk+KCk6IElBY3Rpb25UeXBlPFQ+IHtcbiAgcmV0dXJuIChzdGF0ZSkgPT4gKHsgLi4uc3RhdGUsIGJvcmRlcmVkOiBuZXcgU2V0KFtdKSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEJvcmRlcmVkTm9kZXM8VCA9IGFueT4oaWRzOiBzdHJpbmdbXSk6IElBY3Rpb25UeXBlPFQ+IHtcbiAgcmV0dXJuIChzdGF0ZSkgPT4gKHsgLi4uc3RhdGUsIGJvcmRlcmVkOiBuZXcgU2V0KFsuLi5zdGF0ZS5ib3JkZXJlZCwgLi4uaWRzXSkgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVCb3JkZXJlZE5vZGVzPFQgPSBhbnk+KGlkczogc3RyaW5nW10pOiBJQWN0aW9uVHlwZTxUPiB7XG4gIHJldHVybiAoc3RhdGUpID0+ICh7IC4uLnN0YXRlLCBib3JkZXJlZDogbmV3IFNldChbLi4uc3RhdGUuYm9yZGVyZWRdLmZpbHRlcigoaWQpID0+ICFpZHMuaW5jbHVkZXMoaWQpKSkgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRCb3JkZXJlZE5vZGVzPFQgPSBhbnk+KGlkczogc3RyaW5nW10pOiBJQWN0aW9uVHlwZTxUPiB7XG4gIHJldHVybiAoc3RhdGUpID0+ICh7IC4uLnN0YXRlLCBib3JkZXJlZDogbmV3IFNldChbLi4uaWRzXSkgfSk7XG59XG4iXX0=