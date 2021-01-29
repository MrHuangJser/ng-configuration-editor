import * as _ from 'lodash';
import { CeUtilsService, genNodeId } from '../services';
export function lockNodes(ids) {
    return (state) => (Object.assign(Object.assign({}, state), { nodes: state.nodes.map((node) => (ids.includes(node.id) ? Object.assign(Object.assign({}, node), { locked: true }) : node)) }));
}
export function unlockNodes(ids) {
    return (state) => (Object.assign(Object.assign({}, state), { nodes: state.nodes.map((node) => (ids.includes(node.id) ? Object.assign(Object.assign({}, node), { locked: false }) : node)) }));
}
export function addNodes(nodes) {
    return (state) => (Object.assign(Object.assign({}, state), { nodes: [...state.nodes, ...nodes] }));
}
export function removeNodes(ids) {
    return (state) => {
        let parent = CeUtilsService.shared.getSameLayerParentByChildren(ids, state.nodes);
        if (parent === false) {
            return Object.assign({}, state);
        }
        else if (parent === undefined) {
            return Object.assign(Object.assign({}, state), { nodes: state.nodes.filter((node) => !ids.includes(node.id)) });
        }
        else {
            let originalParentId = parent.id;
            let newNodes = state.nodes.filter((node) => !ids.includes(node.id));
            let prevParent;
            let prevParentId;
            const parents = CeUtilsService.shared.getNodeAndParentListById(parent.id, _.cloneDeep(state.nodes));
            while (parents.length) {
                let parent = parents.shift();
                let children;
                const parentChildren = CeUtilsService.shared.getNodeChildren(parent.id, state.nodes);
                if (parent.id === originalParentId) {
                    children = parentChildren.filter((child) => !ids.includes(child.id));
                }
                else {
                    children = parentChildren
                        .filter((child) => (child.id === prevParentId ? prevParent : child))
                        .filter((child) => !!child);
                }
                prevParentId = parent.id;
                if (children.length > 1) {
                    const rect = CeUtilsService.shared.getOuterBoundingBox(children
                        .map((child) => (Object.assign({ rotate: child.rotate }, CeUtilsService.shared.getChildPositionBaseOnParentCoordinateSystem(parent, parent.rotate, child))))
                        .map((item) => CeUtilsService.shared.getAbsolutePosition(item.cx, item.cy, item.width, item.height, item.rotate)));
                    parent.width = rect.width;
                    parent.height = rect.height;
                    parent.left = rect.left;
                    parent.top = rect.top;
                }
                else if (children.length === 1) {
                    const rect = CeUtilsService.shared.getChildPositionBaseOnParentCoordinateSystem(parent, parent.rotate, children[0]);
                    parent = Object.assign(Object.assign(Object.assign({}, children[0]), rect), { parentId: parent.parentId });
                    newNodes = newNodes.map((node) => (node.id === parent.id ? Object.assign({}, parent) : node));
                }
                else if (children.length === 0) {
                    newNodes = newNodes.filter((node) => node.id !== parent.id);
                    parent = null;
                }
                prevParent = parent;
            }
            return Object.assign(Object.assign({}, state), { nodes: newNodes });
        }
    };
}
export function updateNodes(nodes) {
    return (state) => (Object.assign(Object.assign({}, state), { nodes: state.nodes.map((item) => (Object.assign(Object.assign({}, item), nodes.find((i) => i.id === item.id)))) }));
}
export function updateNodesSize(nodesSizeMap) {
    return (state) => state;
}
export function groupNodes(ids) {
    return (state) => {
        const parent = CeUtilsService.shared.getSameLayerParentByChildren(ids, state.nodes);
        if (parent === false) {
            return state;
        }
        const nodeMap = new Map();
        ids.forEach((id) => {
            const node = state.nodes.find((i) => i.id === id);
            if (node) {
                nodeMap.set(id, node);
            }
        });
        const groupRect = CeUtilsService.shared.getOuterBoundingBox(ids
            .filter((id) => nodeMap.has(id))
            .map((id) => {
            const node = nodeMap.get(id);
            return CeUtilsService.shared.getAbsolutePosition(node.left + node.width / 2, node.top + node.height / 2, node.width, node.height, node.rotate);
        }));
        const groupNode = Object.assign(Object.assign({ id: genNodeId(), name: 'Group' }, groupRect), { rotate: 0, zIndex: Math.max(...state.nodes.filter((node) => !nodeMap.has(node.id)).map((node) => node.zIndex)) + 1, children: ids
                .filter((id) => nodeMap.has(id))
                .map((id) => {
                const node = nodeMap.get(id);
                const { bl, br, tl, tr } = CeUtilsService.shared.getAbsolutePosition(node.left + node.width / 2, node.top + node.height / 2, node.width, node.height, node.rotate);
                return Object.assign(Object.assign({}, node), CeUtilsService.shared.getRelativePosition({
                    bl: [bl[0] - groupRect.left, bl[1] - groupRect.top],
                    br: [br[0] - groupRect.left, br[1] - groupRect.top],
                    tl: [tl[0] - groupRect.left, tl[1] - groupRect.top],
                    tr: [tr[0] - groupRect.left, tr[1] - groupRect.top],
                }));
            }) });
        return Object.assign(Object.assign({}, state), { nodes: [...state.nodes.filter((node) => !nodeMap.has(node.id)), groupNode] });
    };
}
export function breakNode(id) {
    return (state) => {
        const [node, ...parents] = CeUtilsService.shared.getNodeAndParentListById(id, _.cloneDeep(state.nodes));
        const newNodes = node.children.map((child) => {
            var _a, _b;
            return Object.assign(Object.assign(Object.assign({}, child), CeUtilsService.shared.getChildPositionBaseOnParentCoordinateSystem(node, node.rotate, child)), { rotate: ((_a = child.rotate) !== null && _a !== void 0 ? _a : 0) + ((_b = node.rotate) !== null && _b !== void 0 ? _b : 0) });
        });
        if (!parents.length) {
            return Object.assign(Object.assign({}, state), { nodes: [...state.nodes.filter((i) => i.id !== node.id), ...newNodes] });
        }
        else {
            let parent = parents.shift();
            parent.children = [...parent.children.filter((child) => child.id !== node.id), ...newNodes];
            while (parents.length) {
                const nextParent = parents.shift();
                nextParent.children = nextParent.children.map((child) => (child.id === parent.id ? parent : child));
                parent = nextParent;
            }
            return Object.assign(Object.assign({}, state), { nodes: [...state.nodes.filter((i) => i.id !== parent.id), parent] });
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWVkaXRvci1saWIvc3JjLyIsInNvdXJjZXMiOlsibGliL2FjdGlvbnMvbm9kZXMuYWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBWSxNQUFNLGFBQWEsQ0FBQztBQUdsRSxNQUFNLFVBQVUsU0FBUyxDQUFVLEdBQWE7SUFDOUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsaUNBQU0sS0FBSyxLQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGlDQUFNLElBQUksS0FBRSxNQUFNLEVBQUUsSUFBSSxJQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFHLENBQUM7QUFDakksQ0FBQztBQUVELE1BQU0sVUFBVSxXQUFXLENBQVUsR0FBYTtJQUNoRCxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxLQUFLLEtBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUNBQU0sSUFBSSxLQUFFLE1BQU0sRUFBRSxLQUFLLElBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUcsQ0FBQztBQUNsSSxDQUFDO0FBRUQsTUFBTSxVQUFVLFFBQVEsQ0FBVSxLQUFpQjtJQUNqRCxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxLQUFLLEtBQUUs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TUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM3QixNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQWUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUN0RyxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDbkMsVUFBVSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDOUcsTUFBTSxHQUFHLFVBQVUsQ0FBQzthQUNyQjtZQUNELHVDQUFZLEtBQUssS0FBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBRztTQUN4RjtJQUNILENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBDZVV0aWxzU2VydmljZSwgZ2VuTm9kZUlkLCBJRE9NUmVjdCB9IGZyb20gJy4uL3NlcnZpY2VzJztcbmltcG9ydCB7IElBY3Rpb25UeXBlLCBJTm9kZSB9IGZyb20gJy4uL3N0b3JlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGxvY2tOb2RlczxUID0gYW55PihpZHM6IHN0cmluZ1tdKTogSUFjdGlvblR5cGU8VD4ge1xuICByZXR1cm4gKHN0YXRlKSA9PiAoeyAuLi5zdGF0ZSwgbm9kZXM6IHN0YXRlLm5vZGVzLm1hcCgobm9kZSkgPT4gKGlkcy5pbmNsdWRlcyhub2RlLmlkKSA/IHsgLi4ubm9kZSwgbG9ja2VkOiB0cnVlIH0gOiBub2RlKSkgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmxvY2tOb2RlczxUID0gYW55PihpZHM6IHN0cmluZ1tdKTogSUFjdGlvblR5cGU8VD4ge1xuICByZXR1cm4gKHN0YXRlKSA9PiAoeyAuLi5zdGF0ZSwgbm9kZXM6IHN0YXRlLm5vZGVzLm1hcCgobm9kZSkgPT4gKGlkcy5pbmNsdWRlcyhub2RlLmlkKSA/IHsgLi4ubm9kZSwgbG9ja2VkOiBmYWxzZSB9IDogbm9kZSkpIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkTm9kZXM8VCA9IGFueT4obm9kZXM6IElOb2RlPFQ+W10pOiBJQWN0aW9uVHlwZTxUPiB7XG4gIHJldHVybiAoc3RhdGUpID0+ICh7IC4uLnN0YXRlLCBub2RlczogWy4uLnN0YXRlLm5vZGVzLCAuLi5ub2Rlc10gfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVOb2RlczxUID0gYW55PihpZHM6IHN0cmluZ1tdKTogSUFjdGlvblR5cGU8VD4ge1xuICByZXR1cm4gKHN0YXRlKSA9PiB7XG4gICAgbGV0IHBhcmVudCA9IENlVXRpbHNTZXJ2aWNlLnNoYXJlZC5nZXRTYW1lTGF5ZXJQYXJlbnRCeUNoaWxkcmVuKGlkcywgc3RhdGUubm9kZXMpO1xuICAgIGlmIChwYXJlbnQgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSB9O1xuICAgIH0gZWxzZSBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBub2Rlczogc3RhdGUubm9kZXMuZmlsdGVyKChub2RlKSA9PiAhaWRzLmluY2x1ZGVzKG5vZGUuaWQpKSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgb3JpZ2luYWxQYXJlbnRJZCA9IHBhcmVudC5pZDtcbiAgICAgIGxldCBuZXdOb2RlcyA9IHN0YXRlLm5vZGVzLmZpbHRlcigobm9kZSkgPT4gIWlkcy5pbmNsdWRlcyhub2RlLmlkKSk7XG4gICAgICBsZXQgcHJldlBhcmVudDogSU5vZGU7XG4gICAgICBsZXQgcHJldlBhcmVudElkOiBzdHJpbmc7XG4gICAgICBjb25zdCBwYXJlbnRzID0gQ2VVdGlsc1NlcnZpY2Uuc2hhcmVkLmdldE5vZGVBbmRQYXJlbnRMaXN0QnlJZChwYXJlbnQuaWQsIF8uY2xvbmVEZWVwKHN0YXRlLm5vZGVzKSk7XG4gICAgICB3aGlsZSAocGFyZW50cy5sZW5ndGgpIHtcbiAgICAgICAgbGV0IHBhcmVudDogSU5vZGUgPSBwYXJlbnRzLnNoaWZ0KCk7XG4gICAgICAgIGxldCBjaGlsZHJlbjogSU5vZGU8VD5bXTtcbiAgICAgICAgY29uc3QgcGFyZW50Q2hpbGRyZW4gPSBDZVV0aWxzU2VydmljZS5zaGFyZWQuZ2V0Tm9kZUNoaWxkcmVuKHBhcmVudC5pZCwgc3RhdGUubm9kZXMpO1xuICAgICAgICBpZiAocGFyZW50LmlkID09PSBvcmlnaW5hbFBhcmVudElkKSB7XG4gICAgICAgICAgY2hpbGRyZW4gPSBwYXJlbnRDaGlsZHJlbi5maWx0ZXIoKGNoaWxkOiBJTm9kZTxUPikgPT4gIWlkcy5pbmNsdWRlcyhjaGlsZC5pZCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoaWxkcmVuID0gcGFyZW50Q2hpbGRyZW5cbiAgICAgICAgICAgIC5maWx0ZXIoKGNoaWxkOiBJTm9kZTxUPikgPT4gKGNoaWxkLmlkID09PSBwcmV2UGFyZW50SWQgPyBwcmV2UGFyZW50IDogY2hpbGQpKVxuICAgICAgICAgICAgLmZpbHRlcigoY2hpbGQ6IElOb2RlPFQ+KSA9PiAhIWNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2UGFyZW50SWQgPSBwYXJlbnQuaWQ7XG4gICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgY29uc3QgcmVjdCA9IENlVXRpbHNTZXJ2aWNlLnNoYXJlZC5nZXRPdXRlckJvdW5kaW5nQm94KFxuICAgICAgICAgICAgY2hpbGRyZW5cbiAgICAgICAgICAgICAgLm1hcCgoY2hpbGQpID0+ICh7XG4gICAgICAgICAgICAgICAgcm90YXRlOiBjaGlsZC5yb3RhdGUsXG4gICAgICAgICAgICAgICAgLi4uQ2VVdGlsc1NlcnZpY2Uuc2hhcmVkLmdldENoaWxkUG9zaXRpb25CYXNlT25QYXJlbnRDb29yZGluYXRlU3lzdGVtKHBhcmVudCBhcyBJTm9kZSwgKHBhcmVudCBhcyBJTm9kZSkucm90YXRlLCBjaGlsZCksXG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAubWFwKChpdGVtKSA9PiBDZVV0aWxzU2VydmljZS5zaGFyZWQuZ2V0QWJzb2x1dGVQb3NpdGlvbihpdGVtLmN4LCBpdGVtLmN5LCBpdGVtLndpZHRoLCBpdGVtLmhlaWdodCwgaXRlbS5yb3RhdGUpKVxuICAgICAgICAgICk7XG4gICAgICAgICAgcGFyZW50LndpZHRoID0gcmVjdC53aWR0aDtcbiAgICAgICAgICBwYXJlbnQuaGVpZ2h0ID0gcmVjdC5oZWlnaHQ7XG4gICAgICAgICAgcGFyZW50LmxlZnQgPSByZWN0LmxlZnQ7XG4gICAgICAgICAgcGFyZW50LnRvcCA9IHJlY3QudG9wO1xuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIGNvbnN0IHJlY3QgPSBDZVV0aWxzU2VydmljZS5zaGFyZWQuZ2V0Q2hpbGRQb3NpdGlvbkJhc2VPblBhcmVudENvb3JkaW5hdGVTeXN0ZW0ocGFyZW50LCBwYXJlbnQucm90YXRlLCBjaGlsZHJlblswXSk7XG4gICAgICAgICAgcGFyZW50ID0geyAuLi5jaGlsZHJlblswXSwgLi4ucmVjdCwgcGFyZW50SWQ6IHBhcmVudC5wYXJlbnRJZCB9O1xuICAgICAgICAgIG5ld05vZGVzID0gbmV3Tm9kZXMubWFwKChub2RlKSA9PiAobm9kZS5pZCA9PT0gcGFyZW50LmlkID8geyAuLi5wYXJlbnQgfSA6IG5vZGUpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBuZXdOb2RlcyA9IG5ld05vZGVzLmZpbHRlcigobm9kZSkgPT4gbm9kZS5pZCAhPT0gcGFyZW50LmlkKTtcbiAgICAgICAgICBwYXJlbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQYXJlbnQgPSBwYXJlbnQgYXMgSU5vZGU7XG4gICAgICB9XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbm9kZXM6IG5ld05vZGVzIH07XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTm9kZXM8VCA9IGFueT4obm9kZXM6IElOb2RlPFQ+W10pOiBJQWN0aW9uVHlwZTxUPiB7XG4gIHJldHVybiAoc3RhdGUpID0+ICh7IC4uLnN0YXRlLCBub2Rlczogc3RhdGUubm9kZXMubWFwKChpdGVtKSA9PiAoeyAuLi5pdGVtLCAuLi5ub2Rlcy5maW5kKChpKSA9PiBpLmlkID09PSBpdGVtLmlkKSB9KSkgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVOb2Rlc1NpemU8VCA9IGFueT4obm9kZXNTaXplTWFwOiBNYXA8c3RyaW5nLCBJRE9NUmVjdD4pOiBJQWN0aW9uVHlwZTxUPiB7XG4gIHJldHVybiAoc3RhdGUpID0+IHN0YXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBOb2RlczxUID0gYW55PihpZHM6IHN0cmluZ1tdKTogSUFjdGlvblR5cGU8VD4ge1xuICByZXR1cm4gKHN0YXRlKSA9PiB7XG4gICAgY29uc3QgcGFyZW50ID0gQ2VVdGlsc1NlcnZpY2Uuc2hhcmVkLmdldFNhbWVMYXllclBhcmVudEJ5Q2hpbGRyZW4oaWRzLCBzdGF0ZS5ub2Rlcyk7XG4gICAgaWYgKHBhcmVudCA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gICAgY29uc3Qgbm9kZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBJTm9kZT4oKTtcbiAgICBpZHMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgIGNvbnN0IG5vZGUgPSBzdGF0ZS5ub2Rlcy5maW5kKChpKSA9PiBpLmlkID09PSBpZCk7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICBub2RlTWFwLnNldChpZCwgbm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZ3JvdXBSZWN0ID0gQ2VVdGlsc1NlcnZpY2Uuc2hhcmVkLmdldE91dGVyQm91bmRpbmdCb3goXG4gICAgICBpZHNcbiAgICAgICAgLmZpbHRlcigoaWQpID0+IG5vZGVNYXAuaGFzKGlkKSlcbiAgICAgICAgLm1hcCgoaWQpID0+IHtcbiAgICAgICAgICBjb25zdCBub2RlID0gbm9kZU1hcC5nZXQoaWQpO1xuICAgICAgICAgIHJldHVybiBDZVV0aWxzU2VydmljZS5zaGFyZWQuZ2V0QWJzb2x1dGVQb3NpdGlvbihcbiAgICAgICAgICAgIG5vZGUubGVmdCArIG5vZGUud2lkdGggLyAyLFxuICAgICAgICAgICAgbm9kZS50b3AgKyBub2RlLmhlaWdodCAvIDIsXG4gICAgICAgICAgICBub2RlLndpZHRoLFxuICAgICAgICAgICAgbm9kZS5oZWlnaHQsXG4gICAgICAgICAgICBub2RlLnJvdGF0ZVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgKTtcbiAgICBjb25zdCBncm91cE5vZGU6IElOb2RlID0ge1xuICAgICAgaWQ6IGdlbk5vZGVJZCgpLFxuICAgICAgbmFtZTogJ0dyb3VwJyxcbiAgICAgIC4uLmdyb3VwUmVjdCxcbiAgICAgIHJvdGF0ZTogMCxcbiAgICAgIHpJbmRleDogTWF0aC5tYXgoLi4uc3RhdGUubm9kZXMuZmlsdGVyKChub2RlKSA9PiAhbm9kZU1hcC5oYXMobm9kZS5pZCkpLm1hcCgobm9kZSkgPT4gbm9kZS56SW5kZXgpKSArIDEsXG4gICAgICBjaGlsZHJlbjogaWRzXG4gICAgICAgIC5maWx0ZXIoKGlkKSA9PiBub2RlTWFwLmhhcyhpZCkpXG4gICAgICAgIC5tYXAoKGlkKSA9PiB7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVNYXAuZ2V0KGlkKTtcbiAgICAgICAgICBjb25zdCB7IGJsLCBiciwgdGwsIHRyIH0gPSBDZVV0aWxzU2VydmljZS5zaGFyZWQuZ2V0QWJzb2x1dGVQb3NpdGlvbihcbiAgICAgICAgICAgIG5vZGUubGVmdCArIG5vZGUud2lkdGggLyAyLFxuICAgICAgICAgICAgbm9kZS50b3AgKyBub2RlLmhlaWdodCAvIDIsXG4gICAgICAgICAgICBub2RlLndpZHRoLFxuICAgICAgICAgICAgbm9kZS5oZWlnaHQsXG4gICAgICAgICAgICBub2RlLnJvdGF0ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLm5vZGUsXG4gICAgICAgICAgICAuLi5DZVV0aWxzU2VydmljZS5zaGFyZWQuZ2V0UmVsYXRpdmVQb3NpdGlvbih7XG4gICAgICAgICAgICAgIGJsOiBbYmxbMF0gLSBncm91cFJlY3QubGVmdCwgYmxbMV0gLSBncm91cFJlY3QudG9wXSxcbiAgICAgICAgICAgICAgYnI6IFticlswXSAtIGdyb3VwUmVjdC5sZWZ0LCBiclsxXSAtIGdyb3VwUmVjdC50b3BdLFxuICAgICAgICAgICAgICB0bDogW3RsWzBdIC0gZ3JvdXBSZWN0LmxlZnQsIHRsWzFdIC0gZ3JvdXBSZWN0LnRvcF0sXG4gICAgICAgICAgICAgIHRyOiBbdHJbMF0gLSBncm91cFJlY3QubGVmdCwgdHJbMV0gLSBncm91cFJlY3QudG9wXSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgIH07XG4gICAgcmV0dXJuIHsgLi4uc3RhdGUsIG5vZGVzOiBbLi4uc3RhdGUubm9kZXMuZmlsdGVyKChub2RlKSA9PiAhbm9kZU1hcC5oYXMobm9kZS5pZCkpLCBncm91cE5vZGVdIH07XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBicmVha05vZGU8VCA9IGFueT4oaWQ6IHN0cmluZyk6IElBY3Rpb25UeXBlPFQ+IHtcbiAgcmV0dXJuIChzdGF0ZSkgPT4ge1xuICAgIGNvbnN0IFtub2RlLCAuLi5wYXJlbnRzXSA9IENlVXRpbHNTZXJ2aWNlLnNoYXJlZC5nZXROb2RlQW5kUGFyZW50TGlzdEJ5SWQoaWQsIF8uY2xvbmVEZWVwKHN0YXRlLm5vZGVzKSk7XG4gICAgY29uc3QgbmV3Tm9kZXMgPSBub2RlLmNoaWxkcmVuLm1hcCgoY2hpbGQ6IElOb2RlPFQ+KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5jaGlsZCxcbiAgICAgICAgLi4uQ2VVdGlsc1NlcnZpY2Uuc2hhcmVkLmdldENoaWxkUG9zaXRpb25CYXNlT25QYXJlbnRDb29yZGluYXRlU3lzdGVtKG5vZGUsIG5vZGUucm90YXRlLCBjaGlsZCksXG4gICAgICAgIHJvdGF0ZTogKGNoaWxkLnJvdGF0ZSA/PyAwKSArIChub2RlLnJvdGF0ZSA/PyAwKSxcbiAgICAgIH07XG4gICAgfSk7XG4gICAgaWYgKCFwYXJlbnRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG5vZGVzOiBbLi4uc3RhdGUubm9kZXMuZmlsdGVyKChpKSA9PiBpLmlkICE9PSBub2RlLmlkKSwgLi4ubmV3Tm9kZXNdIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBwYXJlbnQgPSBwYXJlbnRzLnNoaWZ0KCk7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4gPSBbLi4ucGFyZW50LmNoaWxkcmVuLmZpbHRlcigoY2hpbGQ6IElOb2RlPFQ+KSA9PiBjaGlsZC5pZCAhPT0gbm9kZS5pZCksIC4uLm5ld05vZGVzXTtcbiAgICAgIHdoaWxlIChwYXJlbnRzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBuZXh0UGFyZW50ID0gcGFyZW50cy5zaGlmdCgpO1xuICAgICAgICBuZXh0UGFyZW50LmNoaWxkcmVuID0gbmV4dFBhcmVudC5jaGlsZHJlbi5tYXAoKGNoaWxkOiBJTm9kZTxUPikgPT4gKGNoaWxkLmlkID09PSBwYXJlbnQuaWQgPyBwYXJlbnQgOiBjaGlsZCkpO1xuICAgICAgICBwYXJlbnQgPSBuZXh0UGFyZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG5vZGVzOiBbLi4uc3RhdGUubm9kZXMuZmlsdGVyKChpKSA9PiBpLmlkICE9PSBwYXJlbnQuaWQpLCBwYXJlbnRdIH07XG4gICAgfVxuICB9O1xufVxuIl19