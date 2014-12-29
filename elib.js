var elib = (function()
{
    var module = {};
    
    function assert(condition, message)
    {
        if(!condition)
        {
            console.error("Assertion failed: " + message + "\nTraceback:");
            console.trace();
        }
    }
    
    module.Entity = function()
    {
        this.components = {};
    };
    module.Entity.prototype.attach = function(component)
    {
        if(this.has(component.constructor))
            throw new Error("Entity already has a component of type " + component.constructor.name);
        
        this.components[component.constructor] = component;
    };
    module.Entity.prototype.remove = function(componentType)
    {
        if(!this.has(componentType))
            throw new Error("Entity does not have a component of type " + componentType.name + " to remove");
        
        delete this.components[componentType];
    };
    module.Entity.prototype.has = function(componentType)
    {
        return this.components.hasOwnProperty(componentType);
    };
    module.Entity.prototype.get = function(componentType)
    {
        if(!this.has(componentType))
            throw new Error("Entity does not have a component of type " + componentType.name);
        
        return this.components[componentType];
    };
    
    //Entity unittest
    (function()
    {
        function TestComponent(state)
        {
            this.state = state;
        }
        
        var ent = new module.Entity();
        
        assert(!ent.has(TestComponent), "entity created; component does not exist");
        ent.attach(new TestComponent(32));
        assert(ent.has(TestComponent), "component exists");
        assert(ent.get(TestComponent).state == 32, "component identity");
        ent.remove(TestComponent);
        assert(!ent.has(TestComponent), "component removal");
    }());
    
    function has_all(entity, componentTypes)
    {
        for(var index in componentTypes)
            if(!entity.has(componentTypes[index]))
                return false;
        
        return true;
    }
    
    module.World = function()
    {
        this.entities = [];
        this.systems = [];
    };
    module.World.prototype.register_system = function(func)
    {
        this.systems.push(func);
    };
    module.World.prototype.register_simple_system = function()
    {
        if(arguments.length < 2)
            throw new Error("register_simple_system requires a function and at least one component type");
        
        var func;
        var componentTypes = [];
        
        for(var index in arguments)
            if(index == 0)
                func = arguments[index];
            else
                componentTypes.push(arguments[index]);
        
        this.systems.push(
            function(world)
            {
                var ents = module.World.prototype.get_entities.apply(world, componentTypes);
                
                for(var index in ents)
                    func(world, ents[index]);
            }
        );
    };
    module.World.prototype.get_entities = function()
    {
        var result = [];
        
        for(var index in this.entities)
        {
            var ent = this.entities[index];
            
            if(has_all(ent, arguments))
                result.push(ent);
        }
        
        return result;
    };
    module.World.prototype.create_entity = function()
    {
        var ent = new module.Entity();
        
        for(var index in arguments)
            ent.attach(arguments[index]);
        
        this.entities.push(ent);
        
        return ent;
    };
    module.World.prototype.destroy_entity = function(entity)
    {
        var index = this.entities.indexOf(entity);
        
        if(index == -1)
            throw new Error("Entity does not exist in this world");
        
        this.entities.pop(index);
    };
    module.World.prototype.update = function()
    {
        for(var index in this.systems)
            this.systems[index](this);
    };
    
    //World unittest
    (function()
    {
        var world = new module.World();
        
        assert(world.get_entities().length == 0, "world created; no entities");
        world.create_entity();
        assert(world.get_entities().length == 1, "entity created");
        
        function ComponentA(state)
        {
            this.state = state;
        }
        
        function ComponentB(state)
        {
            this.state = state;
        }
        
        world = new module.World();
        var entA = world.create_entity(new ComponentA(1));
        var entB = world.create_entity(new ComponentB(2));
        var entC = world.create_entity(new ComponentA(3), new ComponentB(4));
        
        function system_test(world)
        {
            var ents = world.get_entities(ComponentA);
            
            assert(ents[0] === entA, "component A first");
            assert(ents[1] === entC, "component A second");
            
            ents = world.get_entities(ComponentB);
            
            assert(ents[0] === entB, "component B first");
            assert(ents[1] === entC, "component B second");
        }
        
        world.register_system(system_test);
        world.update();
        world.destroy_entity(entC);
        
        world.systems = []
        
        world.register_simple_system(
            function(world, entity)
            {
                assert(entity.has(ComponentA) && !entity.has(ComponentB), "simple system");
            },
            ComponentA
        );
        world.update();
    }());
    
    return module;
}());
