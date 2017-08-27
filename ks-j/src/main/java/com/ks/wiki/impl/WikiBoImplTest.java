package com.ks.wiki.impl;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class WikiBoImplTest {

	WikiBoImpl wikiBo;
	
	@Before
	public void setUp() {
		wikiBo = new WikiBoImpl();
	}
	
	@Test
	public void testGetText() {
		wikiBo.getText("Dennis_Shasha");
	}

}
