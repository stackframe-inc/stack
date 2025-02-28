
import { _StackAdminAppImpl } from "./admin-app-impl";
import { _LazyStackAdminAppImpl, _StackClientAppImpl } from "./client-app-impl";
import { _StackServerAppImpl } from "./server-app-impl";

// See docstring of _LazyStackAdminAppImpl for more details on why we need this
_LazyStackAdminAppImpl.value = _StackAdminAppImpl;

export { _StackAdminAppImpl, _StackClientAppImpl, _StackServerAppImpl };

